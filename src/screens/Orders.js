import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useFonts } from "expo-font";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
// import { useOrderContext } from "./Context/OrderContext";
// import { CartContext } from "./Context/cartContext";

const allOrderItems = [
  {
    name: "Trip 1213898911",
    description: "Rider Trip",
    date: "12/7/2023, 1:40PM ",
    price: 12.34,
    currency: "Miles",
    category: "Trip",
    order_status: "Ongoing",
  },
  {
    name: "Trip 42424442",
    description: "Rider Trip",
    date: "12/7/2023, 1:40PM ",
    price: 12.99,
    currency: "Miles",
    category: "Trip",
    order_status: "Ongoing",
  },
  {
    name: "Trip 746352424",
    description: "Rider Trip",
    date: "12/7/2023, 1:40PM ",
    price: 12.34,
    currency: "Miles",
    category: "Trip",
    order_status: "Closed",
  },
  {
    name: "Trip 9898899",
    description: "Rider Trip",
    date: "12/7/2023, 1:40PM ",
    price: 12.99,
    currency: "Miles",
    category: "Trip",
    order_status: "Closed",
  },
  {
    name: "Trip 31231131",
    description: "Rider Trip",
    date: "12/7/2023, 1:40PM ",
    price: 12.34,
    currency: "Miles",
    category: "Trip",
    order_status: "Closed",
  },
  {
    name: "Trip 879988090",
    description: "Rider Trip",
    date: "12/7/2023, 1:40PM ",
    price: 12.99,
    currency: "Miles",
    category: "Trip",
    order_status: "Closed",
  },
  {
    name: "Trip 1213898",
    description: "Rider Trip",
    date: "12/7/2023, 1:40PM ",
    price: 12.34,
    currency: "Miles",
    category: "Trip",
    order_status: "Closed",
  },
  {
    name: "Trip 9977892",
    description: "Rider Trip",
    date: "12/7/2023, 1:40PM ",
    price: 12.99,
    currency: "Miles",
    category: "Trip",
    order_status: "Closed",
  },
  {
    name: "Trip 12131189898",
    description: "Rider Trip",
    date: "12/7/2023, 1:40PM ",
    price: 12.34,
    currency: "Miles",
    category: "Trip",
    order_status: "Closed",
  },
  {
    name: "Trip 121311898",
    description: "Rider Trip",
    date: "12/7/2023, 1:40PM ",
    price: 12.99,
    currency: "Miles",
    category: "Trip",
    order_status: "Closed",
  },
  {
    name: "Trip 1213118989",
    description: "Rider Trip",
    date: "12/7/2023, 1:40PM ",
    price: 12.34,
    currency: "Miles",
    category: "Trip",
    order_status: "Closed",
  },
  {
    name: "Trip 9898881",
    description: "Rider Trip",
    date: "12/7/2023, 1:40PM ",
    price: 12.99,
    currency: "Miles",
    category: "Trip",
    order_status: "Closed",
  },
  {
    name: "Trip 9212218",
    description: "Rider Trip",
    date: "12/7/2023, 1:40PM ",
    price: 12.34,
    currency: "Miles",
    category: "Trip",
    order_status: "Closed",
  },
  {
    name: "Trip 3132313",
    description: "Rider Trip",
    date: "12/7/2023, 1:40PM ",
    price: 12.99,
    currency: "Miles",
    category: "Trip",
    order_status: "Closed",
  },
  {
    name: "Trip 46576787",
    description: "Rider Trip",
    date: "12/7/2023, 1:40PM ",
    price: 12.34,
    currency: "Miles",
    category: "Trip",
    order_status: "Closed",
  },
  {
    name: "Trip 7988878",
    description: "Rider Trip",
    date: "12/7/2023, 1:40PM ",
    price: 12.99,
    currency: "Miles",
    category: "Trip",
    order_status: "Closed",
  },
  {
    name: "Trip 7821311",
    description: "Rider Trip",
    date: "12/7/2023, 1:40PM ",
    price: 12.34,
    currency: "Miles",
    category: "Trip",
    order_status: "Ongoing",
  },
  {
    name: "Trip 121311898",
    description: "Rider Trip",
    date: "12/7/2023, 1:40PM ",
    price: 12.99,
    currency: "Miles",
    category: "Trip",
    order_status: "Closed",
  },
  // Add more menu items here
];

const OrdersComponent = () => {
  const navigation = useNavigation();
  const scrollTimeout = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [navVisible, setnavVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("default");
  // const categories = ["Category 1", "Category 2", "Category 3"];
  const [sortBy, setSortBy] = useState(null); // State to store the selected sort option
  // const { selectOrderItem, selectedOrderItem } = useOrderContext();
  // const { cartLength } = useContext(CartContext);

  const [menuItems, setMenuItems] = useState(allOrderItems);
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

    if (sortCriteria === "nameAZ") {
      sortedItems.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortCriteria === "nameZA") {
      sortedItems.sort((a, b) => b.name.localeCompare(a.name));
    }

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
  useEffect(() => {
    const filteredMenuItems = allOrderItems.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setMenuItems(filteredMenuItems);
  }, [searchText]);
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
        <Text style={styles.sectionTitle}>Rider Activity</Text>

        <ScrollView
          contentContainerStyle={styles.menuList}
          ref={scrollTimeout}
          onScroll={handleScroll}
        >
          {sortMenuItems().map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                //  selectedItem === index && { backgroundColor: 'lightgrey' },
              ]}
              onPress={() => {
                console.log("pressed");
                // handleMenuItemClick(sortMenuItems()[index]);
                // navigation.navigate("OrderDetailScreen");
                // setIsOpen(false);
              }}
              activeOpacity={0.6}
            >
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.itemPrice}>{item.date}</Text>
                </View>
                <View style={styles.dots}>
                  <View style={styles.priceContainer2}>
                    <Text
                      style={[
                        styles.status,
                        {
                          color:
                            item.order_status === "Closed" ? "green" : "red",
                        },
                      ]}
                    >
                      {item.order_status}
                    </Text>

                    <View style={styles.priceContainer3}>
                      <Text style={styles.itemPrice2}>{`${item.price}`}</Text>
                      <Text style={styles.currency}>{item.currency}</Text>
                    </View>
                  </View>
                  <Icon name="chevron-right" size={34} color="#1D0776" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
