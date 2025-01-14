import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { Layout, Text, TopNav } from "react-native-rapi-ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import * as Location from "expo-location";
import { updateDoc, addDoc } from "firebase/firestore";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { OrderContext } from "../contexts/orderContext";
// import RNFS from "react-native-fs";
import * as FileSystem from "expo-file-system";
import NetInfo from "@react-native-community/netinfo";

const path = FileSystem.documentDirectory + "distanceData.json";

const LOCATION_TASK_NAME = "background-location-task";
// const path = RNFS.DocumentDirectoryPath + "/distanceData.json";

const TripDetails = () => {
  const navigation = useNavigation();
  const { order, setOrder } = useContext(OrderContext);
  console.log("order data stored here:", order);
  // console.log("orderSnapshot :", JSON.stringify(order, null, 2));
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };
  let totalDistance = 0;
  if (order?.status === "Closed") {
    // let totalDistance = 0;
    for (let i = 0; i < order?.Distance.length - 1; i++) {
      const point1 = order?.Distance[i];
      const point2 = order?.Distance[i + 1];
      totalDistance += getDistanceFromLatLonInKm(
        point1.latitude,
        point1.longitude,
        point2.latitude,
        point2.longitude
      );
    }
    console.log("Total Distance:", totalDistance);
  } else {
    console.log("Order is not closed yet!");
  }

  const endTrip = async (orderId) => {
    // await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    const orderDocRef = doc(db, "orders", orderId);
    // const orderSnapshot = await getDoc(orderDocRef);
    // console.log("snapshot :", orderSnapshot);
    // const existingData = orderSnapshot.data();
    NetInfo.fetch().then((state) => {
      if (!state.isConnected) {
        showMessage({
          message: "No Internet Connection",
          description: "Please check your internet connection .",
          type: "danger",
        });
        Alert.alert(
          "No Internet Connection",
          "Please check your internet connection and try again.",
          [{ text: "OK", onPress: () => {} }]
        );
      }
    });

    try {
      // Update the user's location in the database with the updated Distance array
      // Define the tasks to be run concurrently
      const fileContents = await FileSystem.readAsStringAsync(path);
      // console.log("File contents before clearing:", fileContents);
      const data = JSON.parse(fileContents);
      // console.log("Data before clearing:", data);
      const obj = {};
      for (let i = 0; i < data.length; i++) {
        obj[`item${i}`] = data[i];
      }
      const tasks = [
        // Task 1: Stop location updates
        Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME),

        // Task 2: Update the user's location in the database with the updated Distance array
        updateDoc(orderDocRef, {
          status: "Closed",
        }),
        addDoc(collection(db, "backupDistance"), obj),
        // Task 3: Clear the JSON file by writing an empty array to it
        FileSystem.writeAsStringAsync(path, JSON.stringify([])),

        // Task 4: Remove the order ID from AsyncStorage
        AsyncStorage.removeItem("orderId"),
      ];

      // Run the tasks concurrently
      await Promise.all(tasks);
      // console.log(" updated successfully");
      showMessage({
        message: "Success!",
        description: "You have successfully closed Trip .",
        type: "success",
        duration: 1000,
      });
      // fetchEmail();
      // await AsyncStorage.removeItem("orderId");
      setTimeout(() => {
        navigation.navigate("OrderScreen");
      }, 2500);
    } catch (error) {
      // console.error(" error:", error);
      alert(errorMessage);
    }
    // ...
  };
  const [loaded] = useFonts({
    MeriendaOne: require("../../assets/Fonts/MeriendaOne-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }
  return (
    <>
      <Layout>
        <TopNav
          middleContent="Trip Details"
          leftContent={
            <Ionicons
              name="chevron-back"
              size={20}
              // color={"000"}
            />
          }
          leftAction={() => navigation.goBack()}
        />
        <ScrollView style={styles.container}>
          <Text style={styles.price2}>Trip : {order?.id}</Text>
          <Text style={styles.price}>User : {order?.Userid} </Text>
          <View style={styles.startPointContainer}>
            <Text style={styles.startPointTitle}>
              Start: {order?.StartPoint?.name}
            </Text>
            <Text style={styles.startPointSubtitle}>
              Location: {order?.StartPoint?.location || order?.StartPoint?.name}
            </Text>
            {order?.StartPoint?.coordinatesData.map((data, index) => (
              <View key={index} style={styles.coordinatesContainer}>
                <Text style={styles.coordinate}>
                  Latitude: {data?.source?.latitude?.toFixed(6)}
                </Text>
                <Text style={styles.coordinate}>
                  Longitude: {data?.source?.longitude?.toFixed(6)}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.destinationContainer}>
            <Text style={styles.destinationTitle}>
              Destination:{" "}
              {order?.Destination?.name || order?.Destination?.Endpoint}
            </Text>
            <Text style={styles.destinationSubtitle}>
              Location:{" "}
              {order?.Destination?.location || order?.Destination?.Endpoint}
            </Text>
            {order?.Destination?.coordinatesData &&
              order?.Destination?.coordinatesData.map((data, index) => (
                <View key={index} style={styles.coordinatesContainer}>
                  <Text style={styles.coordinate}>
                    Latitude: {data?.source?.latitude?.toFixed(6)}
                  </Text>
                  <Text style={styles.coordinate}>
                    Longitude: {data?.source?.longitude?.toFixed(6)}
                  </Text>
                </View>
              ))}
            {order?.Destination?.source && (
              <View style={styles.coordinatesContainer}>
                <Text style={styles.coordinate}>
                  Latitude: {order?.Destination?.source?.latitude?.toFixed(6)}
                </Text>
                <Text style={styles.coordinate}>
                  Longitude: {order?.Destination?.source?.longitude?.toFixed(6)}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.samplesContainer}>
            <Text style={styles.samplesTitle}>Samples delivered:</Text>
            {order?.quantity?.map((data, index) => (
              <View key={index} style={styles.sampleItemContainer}>
                <Text style={styles.sampleItemName}>{data.item.name}</Text>
                <Text style={styles.sampleItemQuantity}>
                  Quantity:{" "}
                  <Text
                    style={{
                      color: "green",
                    }}
                  >
                    {data.quantity}
                  </Text>
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.price}>
            Trip Status :{" "}
            <Text
              style={{
                color: order?.status === "Ongoing" ? "red" : "green",
              }}
            >
              {order?.status}
            </Text>
          </Text>
          {order?.status === "Closed" && (
            <Text style={styles.price}>
              Trip Distance (kilometers) :{" "}
              <Text
                style={{
                  color: "green",
                }}
              >
                {(Math.ceil(totalDistance * 100) / 100).toLocaleString(
                  "en-US",
                  { maximumFractionDigits: 2 }
                )}
                km
              </Text>
            </Text>
          )}
           {order?.status === "Closed" && (
            <Text style={styles.price}>
              Trip Distance (meters) :{" "}
              <Text
                style={{
                  color: "green",
                }}
              >
               {(Math.ceil(totalDistance * 1000)).toLocaleString("en-US", { maximumFractionDigits: 2 })} m
                
              </Text>
            </Text>
          )}
          {/* Add to Cart button */}
          {order?.status === "Ongoing" && (
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={async () => await endTrip(order?.id)}
            >
              <Text style={styles.addToCartButtonText}>Close Trip</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </Layout>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 20,
    // marginTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    // paddingBottom: 20,
    // width: "100%",
    // marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  cartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  samplesContainer: {
    // padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginVertical: 4,
  },
  samplesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sampleItemContainer: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sampleItemName: {
    fontSize: 14,
    color: "#333",
  },
  sampleItemQuantity: {
    fontSize: 14,
    color: "#333",
  },
  menuItemName: {
    fontSize: 24,
    fontWeight: "bold",
    // marginBottom: 16,
    color: "#1D0776",
  },
  carousel: {
    // Styling for your image carousel
  },
  carouselImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
    // color: "#1D0776",
  },
  price2: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#1D0776",
  },
  description: {
    fontSize: 16,

    marginBottom: 16,
    color: "#001F3F",
  },
  addToCartButton: {
    backgroundColor: "#FF0000",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  addToCartButtonText: {
    color: "white",
    fontSize: 18,
  },
  cartIcon: {
    flexDirection: "row",
    alignItems: "center",
    // marginLeft: 10,
  },
  cartItemCount: {
    backgroundColor: "red",
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0, // Position it at the top
    right: 0, // Position it at the right
  },
  cartItemCountText: {
    color: "white",
    fontWeight: "bold",
  },
  headingBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 10,
    paddingBottom: 5,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    marginBottom: 10,
    // backgroundColor: 'red',
  },
  navigationButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: "40%",
    width: "100%",
    paddingHorizontal: 20,
  },
  startPointContainer: {
    paddingVertical: 7,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginVertical: 4,
  },
  startPointTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 1,
  },
  startPointSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  destinationContainer: {
    paddingVertical: 7,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginVertical: 4,
  },
  destinationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 1,
  },
  destinationSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  coordinatesContainer: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  coordinate: {
    fontSize: 14,
    color: "#333",
  },
  navigationButton: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  navigationButtonText: {
    color: "white",
    fontSize: 44,
  },
  navigationDots: {
    flexDirection: "row",
  },
});

export default TripDetails;
