import React, { useState, useEffect, useContext, useRef } from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import { Layout, Text, TopNav } from "react-native-rapi-ui";
import { Alert } from 'react-native';
import FlashMessage, { showMessage } from "react-native-flash-message";
// import { HospitalDataContext } from "../contexts/hospitalContext";
// import { FlatList, TouchableOpacity } from "react-native";
// import { SearchBar, Icon } from "react-native-elements";
// import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import MapView from "react-native-maps";
// import Pulse from "react-native-pulse";
import { StyleSheet } from "react-native";
import MapViewDirections from "react-native-maps-directions";
import { Swipeable } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Animatable from "react-native-animatable";
import { SelectedHospitalContext } from "../contexts/locationsContext";
import { HospitalDataContext } from "../contexts/hospitalContext";
import haversine from "haversine";
export default function ({ navigation }) {
  const swipeableRef = useRef(null);
  const [tripStarted, setTripStarted] = useState(false);
  const { hospitalData } = useContext(HospitalDataContext);
  const { startPoint, destination } = useContext(SelectedHospitalContext);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    };

    getLocation();
  }, []);

  const handlePress = () => {
    const startLocation = {
      latitude: startPoint?.coordinatesData?.[0]?.source?.latitude,
      longitude: startPoint?.coordinatesData?.[0]?.source?.longitude,
    };

    const distance = haversine(currentLocation, startLocation, {
      unit: "meter",
    });

    if (distance > 50) {
      showMessage({
        message: "Error!",
        description: "Failed to start the trip.",
        type: "danger",
        duration: 3000,
      });
      Alert.alert(
        "Error !", // Title
        "You are not within 50 meters of the start point. The trip cannot be started. Please move towards the start point." // Message
      );
      swipeableRef.current?.close();
    } else {
      // Start the trip
      showMessage({
        message: "Success!",
        description: "You have started the trip.",
        type: "success",
        duration: 2000,
      });
      setTripStarted(!tripStarted);
    }
  };
  // console.log("Destination:", JSON.stringify(destination, null, 2));
  // console.log("startPoint:", JSON.stringify(startPoint, null, 2));
  const GOOGLE_MAPS_APIKEY = "AIzaSyAva8VdYE32GpTxn6zxQM56rFfhj7tx690";
  const origin = { latitude: 37.3318456, longitude: -122.0296002 };
  // const destination = { latitude: 37.771707, longitude: -122.4053769 };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Layout>
        <TopNav
          middleContent="Map"
          leftContent={
            <Ionicons
              name="chevron-back"
              size={20}
              // color={"000"}
            />
          }
          leftAction={() => navigation.goBack()}
        />
        <View style={styles.container}>
          {initialRegion && (
            <MapView
              style={StyleSheet.absoluteFill}
              initialRegion={initialRegion}
              provider={PROVIDER_GOOGLE}
              showsUserLocation
              showsMyLocationButton
              zoomEnabled={true}
            >
              {currentLocation && (
                <Marker
                  coordinate={{
                    latitude: currentLocation?.latitude,
                    longitude: currentLocation?.longitude,
                  }}
                  title="My Location"
                />
              )}
              {startPoint &&
                startPoint?.coordinatesData?.[0] &&
                startPoint?.coordinatesData?.[0]?.source && (
                  <Marker
                    coordinate={{
                      latitude:
                        startPoint?.coordinatesData?.[0]?.source?.latitude,
                      longitude:
                        startPoint?.coordinatesData?.[0]?.source?.longitude,
                    }}
                    title={`Start Point: ${startPoint?.name}`}
                  />
                )}
              {destination &&
                destination?.coordinatesData?.[0] &&
                destination?.coordinatesData?.[0]?.source && (
                  <Marker
                    coordinate={{
                      latitude:
                        destination?.coordinatesData?.[0]?.source?.latitude,
                      longitude:
                        destination?.coordinatesData?.[0]?.source?.longitude,
                    }}
                    title={`Destination: ${destination?.name}`}
                  />
                )}
              {startPoint?.coordinatesData?.[0]?.source &&
                destination?.coordinatesData?.[0]?.source && (
                  <MapViewDirections
                    origin={startPoint.coordinatesData[0].source}
                    destination={destination.coordinatesData[0].source}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={3}
                    strokeColor="green"
                  />
                )}
              {hospitalData.map(
                (hospital, index) =>
                  hospital?.coordinatesData?.[0]?.source && (
                    <Marker
                      key={index}
                      coordinate={{
                        latitude:
                          hospital?.coordinatesData?.[0]?.source?.latitude,
                        longitude:
                          hospital?.coordinatesData?.[0]?.source?.longitude,
                      }}
                      title={`Hospital : ${hospital?.name}`}
                      pinColor="blue"
                    />
                  )
              )}
            </MapView>
          )}
        </View>
        <Swipeable
          ref={swipeableRef}
          onSwipeableOpen={() => {
            handlePress();
            console.log("Swipe left successful!");
          }}
          renderLeftActions={(progress, dragX) => {
            const trans = dragX.interpolate({
              inputRange: [0, 50, 100, 101],
              outputRange: [-20, 0, 0, 1],
            });
            return (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "green",
                  height: 60,
                  padding: 10,
                  marginVertical: 4,
                  marginHorizontal: 8,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#ccc", // black
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  flex: 1,
                }}
              >
                <Animated.Text
                  style={[
                    {
                      // transform: [{ translateX: trans }],
                      color: "white",
                      fontWeight: "600",
                      textAlign: "right",
                    },
                  ]}
                >
                  Trip Started
                </Animated.Text>
              </View>
            );
          }}
        >
          <Animatable.View
            animation="pulse"
            easing="ease-out"
            iterationCount="infinite"
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#90EE90", // light green
              height: 60,
              padding: 10,
              marginVertical: 4,
              marginHorizontal: 8,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#ccc", // grey
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Ionicons name="chevron-forward-outline" size={24} color="#000" />
            <Text style={{ textAlign: "center", color: "#000" }}>
              Swipe Right to Start trip ...
            </Text>
          </Animatable.View>
        </Swipeable>
      </Layout>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
