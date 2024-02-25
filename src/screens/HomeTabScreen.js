import React, { useContext, useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Image,
} from "react-native";
import { Layout, Text } from "react-native-rapi-ui";
// import { HospitalDataContext } from "../contexts/hospitalContext";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Import the icon component
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "react-native-elements";

export default function HomeScreenTab({ navigation }) {
  const [greeting, setGreeting] = useState("");
  const [user, setUser] = useState(null);
  // const { hospitalData, fetchData } = useContext(HospitalDataContext);

  // console.log("user", user);
  // console.log("user:", JSON.stringify(user, null, 2));

  useEffect(() => {
    const fetchData = async () => {
      const currentTime = new Date();
      const hours = currentTime.getHours();

      let newGreeting;
      const storedEmail = await AsyncStorage.getItem("user");
      const parsedUser = JSON.parse(storedEmail);
      setUser(parsedUser);
      if (hours < 12) {
        newGreeting = "Good Morning,";
      } else if (hours < 17) {
        newGreeting = "Good Afternoon,";
      } else {
        newGreeting = "Good Evening,";
      }

      setGreeting(newGreeting);
    };

    fetchData();
  }, []);
  return (
    <Layout>
      <ImageBackground
        source={require("../../assets/bg.png")}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
       <View style={styles.logoContainer}>
  <View style={styles.logoWrapper}>
    <Image source={require("../../assets/logo2.png")} style={styles.logoImage} />
  </View>
  <Text style={styles.sectionTitle}>Medi-Track</Text>
</View>
        <View style={styles.container}>
          <Card
            containerStyle={{
              borderRadius: 10,
              margin: 0,
              marginBottom: 10,
              paddingBottom: 30,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 180 },
              shadowOpacity: 4.0,
              shadowRadius: 10,
              elevation: 10,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#1D0776",
                marginBottom: 8,
              }}
            >
              {`Hello ${greeting}`}
            </Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "600",
                color: "#1D0776",
                marginBottom: 10,
              }}
            >
              {user?.displayName ? user.displayName : user?.email}
            </Text>
            <Text
              style={{
                fontSize: 19,
                color: "#000",
                marginBottom: 10,
              }}
            >
              Welcome! Please choose an action from the options below:
            </Text>
          </Card>
          <Text style={styles.sectionTitle}>My Options</Text>
          <View style={styles.cardsContainer}>
            {/* Top Row */}
            <View style={styles.row}>
              <ServiceCard
                title="New Trip"
                imageSource={require("../../assets/rider6.jpg")}
                styleEffect={styles.cardImage1}
                isNew={true}
                icon={"bicycle"}
                pageFunction={() => navigation.navigate("Home")}
              />
              <ServiceCard
                title="My Trips"
                imageSource={require("../../assets/trip2.png")}
                styleEffect={styles.cardImage1}
                isNew={true}
                icon={"cart"}
                pageFunction={() => navigation.navigate("OrderScreen")}
              />
            </View>
            <View style={styles.row}>
              <ServiceCard
                title="Help"
                imageSource={require("../../assets/help2.png")}
                styleEffect={styles.cardImage1}
                isNew={true}
                icon={"help-circle"}
                pageFunction={() => navigation.navigate("HelpScreen")}
              />
              <ServiceCard
                title="Account"
                imageSource={require("../../assets/person2.png")}
                styleEffect={styles.cardImage1}
                isNew={true}
                icon={"person"}
                pageFunction={() => navigation.navigate("Profile")}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </Layout>
  );
}

const ServiceCard = ({
  title,
  imageSource,
  styleEffect,
  isNew,
  pageFunction,
  icon,
}) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={pageFunction}
        style={[styles.rippleContainer, { borderRadius: 20 }]}
        activeOpacity={0.7}
      >
        <View>
          <Image source={imageSource} style={styleEffect} />
          {isNew && (
            <View style={styles.newLabel}>
              <Text style={styles.newLabelText}>NEW</Text>
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon
              name={icon}
              size={23}
              color="#1D0776"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.cardTitle}>{title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topTabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  bottomTabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 20,
  },
  tabContainer: {
    alignItems: "center",
    backgroundColor: "#3350FF",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
  },
  container: {
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "300",
    marginBottom: 8,
    color: "#fff",
    // textDecorationLine: 'underline',
  }, logoContainer: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center items vertically
  },
  logoImage: {
    width: 50, // Adjust the width as needed
    height: 50, // Adjust the height as needed
    resizeMode: 'contain', // Maintain aspect ratio and fit container
    marginRight: 10, // Add margin for spacing
  },
  cardsContainer: {
    flexDirection: "column",
    marginTop: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 6,
  },
  row1: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 6,
  },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1.0,
    shadowRadius: 10,
    elevation: 10,
    justifyContent: "center", // Center vertically
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  newLabel: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "green", // Customize the background color
    padding: 1,
    // marginTop: 1,
    marginRight: 2,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  newLabelText: {
    color: "white",
    fontWeight: "bold",
  },
  cardImage: {
    width: 70,
    height: 70,
    marginBottom: 10,
    resizeMode: "contain",
    borderRadius: 8,
  },
  cardImage1: {
    width: 130,
    height: 100,
    marginBottom: 5,
    resizeMode: "contain",
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1D0776",
  },
});
