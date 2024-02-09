import React, { useEffect, useState, useRef, useContext } from "react";
import {
  // View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import { View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
// import { useOrderContext } from "./Context/OrderContext";
// import { CartContext } from "./Context/cartContext";
// import React, { useState, useEffect, createContext } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Location from 'expo-location';
import { OrderContext } from '../contexts/orderContext';
import { updateDoc, addDoc } from "firebase/firestore";
import FlashMessage, { showMessage } from "react-native-flash-message";
const LOCATION_TASK_NAME = 'background-location-task';

const OrdersComponent = () => {
  const navigation = useNavigation();
  const { order, setOrder } = useContext(OrderContext);
  const scrollTimeout = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [navVisible, setnavVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [orderData, setOrderData] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("default");
  const [loading, setLoading] = useState(true);
  const endTrip = async (orderId) => {    
  
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME); 
    const orderDocRef = doc(db, "orders", orderId);
    // const orderSnapshot = await getDoc(orderDocRef);
    // console.log("snapshot :", orderSnapshot);
    // const existingData = orderSnapshot.data();
    
    try {
      // Update the user's location in the database with the updated Distance array
      await updateDoc(orderDocRef, {
        status: "Closed",
      });
      console.log(" updated successfully");
      showMessage({
        message: "Success!",
        description: "You have successfully closed Trip in.",
        type: "success",
        duration: 1000,
      });
      fetchEmail();
      await AsyncStorage.removeItem("orderId");
    } catch (error) {
      console.error(" error:", error);
      alert(errorMessage);
    } 
    // ...
  };
  // const categories = ["Category 1", "Category 2", "Category 3"];
  const [sortBy, setSortBy] = useState(null); // State to store the selected sort option
  // const { selectOrderItem, selectedOrderItem } = useOrderContext();
  // const { cartLength } = useContext(CartContext);
  const [email, setEmail] = useState("");
  const fetchEmail = async () => {
    setLoading(true);
    const storedEmail = await AsyncStorage.getItem("user");
    // console.log("user",storedEmail)
    if (storedEmail !== null) {
      const user = JSON.parse(storedEmail);
      setEmail(user.email);
      // console.log("user", user.email);

      const fetchData = async () => {
        const q = query(
          collection(db, "orders"),
          where("Userid", "==", user.email)
        );
        const querySnapshot = await getDocs(q);

        const orders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })).sort((a, b) => b.time.seconds - a.time.seconds);

        // Log the orders
        // console.log("Orders:", JSON.stringify(orders, null, 2));

        // Set the orderData state variable with the fetched data
        setOrderData(orders);
      };

      // Call fetchData
      await fetchData();

      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEmail();
  }, []);

  const [menuItems, setMenuItems] = useState(orderData);
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY < 100) {
      // Show the navbar if the offset is less than 100
      setIsVisible(true);
    } else {
      // Hide the navbar by default
      setIsVisible(false);
    }

    // Clear the previous scroll timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Set a timeout to show the navbar when scrolling stops
    scrollTimeout.current = setTimeout(() => {
      setIsVisible(true);
    }, 1000); // Adjust the timeout delay as needed
  };
  const detailPage = setTimeout(() => {
    // navigation.navigate("DashboardScreen");
    //   setShowSplash(false);
  }, 1500); // 2 seconds
  const sortMenuItems = () => {
    let sortedItems = [...menuItems];

    // if (sortCriteria === "nameAZ") {
    //   sortedItems.sort((a, b) => a.name.localeCompare(b.name));
    // } else if (sortCriteria === "nameZA") {
    //   sortedItems.sort((a, b) => b.name.localeCompare(a.name));
    // }
    console.log("items", sortedItems);

    return sortedItems;
  };
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    // Handle category selection, e.g., filter menu items based on the selected category
  };

  const handleCloseSidebar = () => {
    setIsOpen(false);
  };
  const handleMenuItemClick = (item) => {
    // Handle menu item selection Order
    // selectOrderItem(item);
    console.log("item clicked", item);
  };
  // useEffect(() => {
  //   const filteredMenuItems = allOrderItems.filter((item) =>
  //     item.name.toLowerCase().includes(searchText.toLowerCase())
  //   );
  //   setMenuItems(filteredMenuItems);
  // }, [searchText]);
  const [selectedItem, setSelectedItem] = useState(null);

  // const profileImageUrl = {require('../assets/logo.jpg')};
  const [loaded] = useFonts({
    MeriendaOne: require("../../assets/Fonts/MeriendaOne-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }
  return (
    <>
      <View style={styles.container}>
        <View style={styles.container_title}>
          {/* <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>My Orders</Text>
          </View> */}
          {/* <TouchableOpacity
            style={styles.cartIcon}
            onPress={() => {
              navigation.navigate("CartScreen");
            }}
          >
            
            <View style={styles.cartItemCount}>
              <Text style={styles.cartItemCountText}>{cartLength}</Text>
            </View>
          </TouchableOpacity> */}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Text style={styles.sectionTitle}>Rider Activity</Text>
          <View style={{ marginRight: 50 }}>
            <Button title="Refresh" onPress={fetchEmail} color="#3350FF" />
          </View>
          
        </View>
        <Text
            style={{
              fontSize: 15,
              fontWeight: "400",
              marginBottom: 10,
              color: "#1D0776",
              textDecorationLine: 'underline',
            }}
          >
            * Press Refresh to get new Updates*
          </Text>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center", // Center vertically
              alignItems: "center", // Center horizontally
              backgroundColor: "#f5f5f5",
            }}
          >
            <ActivityIndicator size={60} color="#3350FF" />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.menuList}
            ref={scrollTimeout}
            onScroll={handleScroll}
          >
            {/* <Button title="Refresh" onPress={fetchEmail} /> */}
            {orderData.length === 0 ? (
              <Text style={styles.itemName}>You have no Trips yet.</Text>
            ) : (
              orderData.map((order, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.menuItem,
                    // selectedItem === index && { backgroundColor: 'lightgrey' },
                  ]}
                  onPress={async () => {
                    // console.log("pressed");
                    // await endTrip(order.id);
                    await setOrder(order);
                    // handleMenuItemClick(sortMenuItems()[index]);
                    navigation.navigate("TripDetailScreen");
                
                  }}
                  activeOpacity={0.6}
                >
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>Trip {order.id}</Text>
                    {/* Display other relevant information from the order */}
                    {/* <Text style={styles.itemDescription}>{order.status}</Text> */}
                    <Text style={styles.itemDescription}>
                      {new Date(order.time.seconds * 1000).toLocaleString()}
                    </Text>
                    {/* Add additional information as needed */}
                    <View style={styles.priceContainer}>
                      {/* Render other properties as needed */}
                      <Text style={styles.itemPrice}>
                        {order.Destination.name}
                      </Text>
                    </View>
                    <View style={styles.dots}>
                      <View style={styles.priceContainer2}>
                        <Text
                          style={[
                            styles.status,
                            {
                              color:
                                order.status === "Closed" ? "green" : "red",
                            },
                          ]}
                        >
                          {order.status}
                        </Text>
                        {/* Render other properties as needed */}
                        <View style={styles.priceContainer3}>
                          {/* Render other properties as needed */}
                          <Text
                            style={styles.itemPrice2}
                          >{`${order.quantity[0].quantity}`}</Text>
                          {/* Render other properties as needed */}
                          <Text style={styles.currency}>
                            {order.quantity[0].item.name}
                          </Text>
                        </View>
                      </View>
                      <Icon name="chevron-right" size={34} color="#1D0776" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 10,
    color: "#fff",
    //marginTop: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1D0776",
  },
  sectionTitle2: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 5,
    color: "#1D0776",
  },
  menuList: {
    flexGrow: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
    // borderBottomWidth: 1,
    // borderBottomColor: 'lightgray',
    // paddingBottom: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    paddingBottom: 6,
  },
  menuBar: { borderWidth: 1, borderColor: "lightgray", borderRadius: 3 },
  itemName: {
    fontSize: 18,
    fontWeight: "400",
    color: "black",
  },
  menuItemPressed: {
    backgroundColor: "lightgrey", // Background color for the pressed state
  },
  itemDescription: {
    fontSize: 14,
    color: "gray",
    marginBottom: 4,
  },
  container_title: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingRight: 18,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceContainer2: {
    flexDirection: "col",
    alignItems: "center",
  },
  status: {
    fontSize: 18,
  },
  priceContainer3: {
    flexDirection: "row",
    alignItems: "center",
  },
  dots: {
    flexDirection: "row",
    position: "absolute",
    top: 0,
    right: 0,
    padding: 10, // Adjust this value for spacing
  },

  itemPrice: {
    fontSize: 15,
    fontWeight: "400",
    color: "#1D0776",
  },
  textContainer: {
    flex: 1,
  },
  itemPrice2: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1D0776",
  },
  currency: {
    fontSize: 14,
    color: "#1D0776",
    marginLeft: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: 'red',
  },
  searchContainer: {
    width: "75%",
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  searchInputContainer: {
    backgroundColor: "white",
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
  sortDropdown: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    width: "85%",
    justifyContent: "center",
    marginBottom: 4,
  },
  pickerStyle: {
    height: 40,
    color: "#1D0776",
  },
  pickerStyle2: {
    color: "#1D0776",
  },
});

export default OrdersComponent;
