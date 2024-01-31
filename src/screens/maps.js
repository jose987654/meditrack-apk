import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Layout, Text, TopNav } from "react-native-rapi-ui";
// import { HospitalDataContext } from "../contexts/hospitalContext";
// import { FlatList, TouchableOpacity } from "react-native";
// import { SearchBar, Icon } from "react-native-elements";
// import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import MapView from "react-native-maps";
import { StyleSheet } from "react-native";
// import MapViewDirections from "react-native-maps-directions";

export default function ({ navigation }) {
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
  const GOOGLE_MAPS_APIKEY = "AIzaSyAva8VdYE32GpTxn6zxQM56rFfhj7tx690";
  const origin = { latitude: 37.3318456, longitude: -122.0296002 };
  const destination = { latitude: 37.771707, longitude: -122.4053769 };
  return (
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
            style={styles.map}
            initialRegion={initialRegion}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            showsMyLocationButton
          >
            {currentLocation && (
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                title="My Location"
              />
            )}
            {/* <MapViewDirections
    origin={{
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      }}
    destination={destination}
    apikey={GOOGLE_MAPS_APIKEY}
  /> */}
            {/* <Marker
                coordinate={origin}
                title=" Location 2"
              /> */}
          </MapView>
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
