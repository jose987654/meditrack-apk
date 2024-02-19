import React, { useState, useEffect, useContext, useRef } from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import { Layout, Text, TopNav } from "react-native-rapi-ui";
import { Alert } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
// import { HospitalDataContext } from "../contexts/hospitalContext";
// import { FlatList, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
// import { Picker } from "@react-native-picker/picker";
import { collection, updateDoc, addDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
// import * as Location from "expo-location";
import { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import MapView from "react-native-maps";
// import Pulse from "react-native-pulse";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Import your Firestore instance
import { StyleSheet } from "react-native";
import MapViewDirections from "react-native-maps-directions";
import { Swipeable } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Animatable from "react-native-animatable";
import { SelectedHospitalContext } from "../contexts/locationsContext";
import { HospitalDataContext } from "../contexts/hospitalContext";
import haversine from "haversine";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import * as Location from "expo-location";
// import RNFS from "react-native-fs";
// import * as FileSystem from 'expo-file-system';

// const path = FileSystem.documentDirectory + "distanceData.json";

const LOCATION_TASK_NAME = "background-location-task";
// Define the path for the JSON file
// const path = RNFS.DocumentDirectoryPath + "/distanceData.json";
TaskManager.defineTask(
  LOCATION_TASK_NAME,
  async ({ data: { locations }, error }) => {
    if (error) {
      // Error occurred - check `error.message` for more details.
      return;
    }
    if (locations) {
      // locations is an array of location objects
      const location = locations[0];

      // Retrieve the order ID and current location from AsyncStorage
      const orderId = await AsyncStorage.getItem("orderId");
      // console.log("orderid :", orderId);
      const currentLocation = JSON.parse(
        await AsyncStorage.getItem("currentLocation")
      );
      // console.log("currentLocation :", currentLocation);
      // Update the user's location in the database
      const orderDocRef = doc(db, "orders", orderId);
      const orderSnapshot = await getDoc(orderDocRef);
      // console.log("snapshot :", orderSnapshot);
      const existingData = orderSnapshot.data();
      // console.log("existingData :", existingData);
      // console.log("snapshot :", orderSnapshot);
      const existingDistance = existingData.Distance || [];
      // const updatedDistance = [...existingDistance, currentLocation];
      const existingDistanceArray = Object.values(existingDistance);

      existingDistanceArray.push({ ...currentLocation });
      // console.log("Updated Distance Array:", existingDistanceArray);
      // console.log("orderSnapshot :", JSON.stringify(existingData, null, 2));
      // const orderDoc = doc(db, "orders", orderId);
      // RNFS.exists(path).then((exists) => {
      //   if (!exists) {
      //     // If the file doesn't exist, initialize it with an empty object
      //     const initialData = {};

      //     // Convert the initial data to a JSON string
      //     const jsonString = JSON.stringify(initialData);

      //     // Write the JSON string to the file
      //     RNFS.writeFile(path, jsonString, "utf8")
      //       .then(() => {
      //         console.log("JSON file created successfully");
      //       })
      //       .catch((error) => {
      //         console.error("Error creating JSON file:", error);
      //       });
      //   }
      // });
      try {
        // Update the user's location in the database with the updated Distance array
        // Define the tasks to be run concurrently
        const tasks = [
          // Task 1: Update the user's location in the database with the updated Distance array
          updateDoc(orderDocRef, {
            Distance: existingDistanceArray,
          }),

          // Task 2: Read existing data from the file
          // RNFS.readFile(path, "utf8").then((existingFileData) => {
          //   const existingJsonData = existingFileData
          //     ? JSON.parse(existingFileData)
          //     : [];

          //   // Append new data
          //   existingJsonData.push(existingDistanceArray);

          //   // Write updated data back to the file
          //   const jsonString = JSON.stringify(existingJsonData);
          //   return RNFS.writeFile(path, jsonString, "utf8");
          // }),
        ];
        // Run the tasks concurrently
        await Promise.all(tasks);

        console.log("Distance array updated successfully");
        // console.log("Distance array written to local file");
      } catch (error) {
        console.error("Error updating Distance array:", error);
      }
    }
  }
);
export default function ({ navigation }) {
  const swipeableRef = useRef(null);
  const mapViewRef = useRef();
  const [tripStarted, setTripStarted] = useState(false);
  const { hospitalData } = useContext(HospitalDataContext);
  const { startPoint, destination, samples } = useContext(
    SelectedHospitalContext
  );
  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert(
          "This app needs access to your location to function properly. Please grant location access."
        );
        console.log("Permission to access location was denied");
        return;
      }
      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== "granted") {
        alert(
          "This app needs access to your background location to function properly. Please grant background location access."
        );
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
  const [email, setEmail] = useState("");
  const zoomIn = () => {
    if (initialRegion) {
      let newRegion = {
        ...initialRegion,
        latitudeDelta: initialRegion.latitudeDelta / 2,
        longitudeDelta: initialRegion.longitudeDelta / 2,
      };
      mapViewRef.current.animateToRegion(newRegion, 500);
    }
  };

  const zoomOut = () => {
    if (initialRegion) {
      let newRegion = {
        ...initialRegion,
        latitudeDelta: initialRegion.latitudeDelta * 2,
        longitudeDelta: initialRegion.longitudeDelta * 2,
      };
      mapViewRef.current.animateToRegion(newRegion, 500);
    }
  };
  const ZoomInButton = ({ onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#f2f2f2",
        padding: 10,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        margin: 5,
      }}
    >
      <Icon name={"add"} size={22} color={"black"} />
    </TouchableOpacity>
  );

  const ZoomOutButton = ({ onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#f2f2f2",
        padding: 10,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        margin: 5,
      }}
    >
      <Icon name={"remove"} size={22} color={"black"} />
    </TouchableOpacity>
  );
  useEffect(() => {
    const fetchEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("user");
      if (storedEmail !== null) {
        const user = JSON.parse(storedEmail);
        // console.log("stored useer", user)
        setEmail(user.email);
      }
    };

    fetchEmail();
  }, []);
  const handlePress = async () => {
    // await AsyncStorage.removeItem("orderId");
    // Check if orderId exists in AsyncStorage
    const orderId = await AsyncStorage.getItem("orderId");
    if (orderId) {
      Alert.alert(
        "Ongoing Trip",
        "You have an ongoing trip. Please finish / Close it before starting a new one.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("OrderScreen"),
          },
        ]
      );
      return;
    }
    const startLocation = {
      latitude: startPoint?.coordinatesData?.[0]?.source?.latitude,
      longitude: startPoint?.coordinatesData?.[0]?.source?.longitude,
    };

    const distance = haversine(currentLocation, startLocation, {
      unit: "meter",
    });

    if (distance > 500000000) {
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
      if (!startPoint || !destination) {
        console.log(
          "Start point or destination is null. Cannot submit trip order."
        );
        return;
      }
      // const startLocation = new firebase.firestore.GeoPoint(
      //   startPoint.latitude,
      //   startPoint.longitude
      // );
      // const destinationLocation = new firebase.firestore.GeoPoint(
      //   destination.latitude,
      //   destination.longitude
      // );

      const orderData = {
        Destination: destination,
        Distance: [currentLocation],
        StartPoint: startPoint,
        Userid: email,
        quantity: samples,
        status: "Ongoing",
        time: new Date(),
      };

      // console.log("orderData :", JSON.stringify(orderData, null, 2));
      try {
        const docRef = await addDoc(collection(db, "orders"), orderData);
        console.log("Document written with ID: ", docRef.id);

        // Start the background location updates
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 30000, // Update every second
          distanceInterval: 1, // Or every meter
          // showsBackgroundLocationIndicator: true,
        });

        // Save the order ID and current location to AsyncStorage for use in the background task
        await AsyncStorage.setItem("orderId", docRef.id);
        await AsyncStorage.setItem(
          "currentLocation",
          JSON.stringify(currentLocation)
        );

        showMessage({
          message: "Success!",
          description: "You have started the trip.",
          type: "success",
          duration: 2000,
        });
        setTripStarted(!tripStarted);
        setTimeout(() => {
          navigation.navigate("OrderScreen");
        }, 3000);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
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
        {initialRegion && (
          <>
            <View style={styles.container}>
              <MapView
                ref={mapViewRef}
                style={StyleSheet.absoluteFill}
                initialRegion={initialRegion}
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                showsMyLocationButton
                zoomEnabled={true}
                onRegionChangeComplete={setInitialRegion}
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
            </View>
            <View
              style={{
                position: "absolute",
                right: 10,
                bottom: 80,
                alignItems: "center",
                backgroundColor: "grey",
                borderRadius: 5,
              }}
            >
              <ZoomInButton onPress={zoomIn} />
              <ZoomOutButton onPress={zoomOut} />
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
                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color="#000"
                />
                <Text style={{ textAlign: "center", color: "#000" }}>
                  Swipe Right to Start trip ...
                </Text>
              </Animatable.View>
            </Swipeable>
          </>
        )}
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
