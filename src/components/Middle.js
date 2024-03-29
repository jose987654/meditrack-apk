import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { HospitalDataContext } from "../contexts/hospitalContext";

export default function Middle() {
  const [email, setEmail] = useState("");
  const [ongoingOrdersCount, setOngoingOrdersCount] = useState(0);
  const [reviewedOrdersCount, setReviewedOrdersCount] = useState(0);
  const [closedOrdersCount, setClosedOrdersCount] = useState(0);
  const { orderData } = useContext(HospitalDataContext);
  // console.log("orders",orderData);
  useEffect(() => {
    const fetchEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("user");
      if (storedEmail !== null) {
        const user = JSON.parse(storedEmail);
        setEmail(user);
      }
    };

    const countOrders = () => {
      const ongoingOrders = orderData.filter(
        (order) => order?.status === "Closed"
      );
      const reviewedOrders = orderData.filter(
        (order) => order?.status === "Reviewed"
      );
      const closedOrders = orderData.filter(
        (order) => order?.status === "Approved"
      );

      setOngoingOrdersCount(ongoingOrders?.length);
      setReviewedOrdersCount(reviewedOrders?.length);
      setClosedOrdersCount(closedOrders?.length);
    };

    fetchEmail();
    countOrders();
  }, [orderData]);
  return (
    <View style={styles.main}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("../../assets/person2.png")}
        />
        
        {email?.displayName ? (
          <Text style={{ fontSize: 18, color: "white", fontWeight: "500" }}>
            {email?.displayName}
          </Text>
        ) : null}

        <Text style={{ fontSize: 18, color: "white", fontWeight: "500" }}>
          {email?.email}
        </Text>
      </View>

      <View style={styles.middleSectionTextContainer}>
        <View style={styles.middleSectionText}>
          <Text style={styles.toptext}>Total Trips</Text>
          <Text style={styles.bottomtext}>{orderData?.length}</Text>
        </View>
        <View style={styles.middleSectionText}>
          <Text style={styles.toptext}>Closed Trips</Text>
          <Text style={styles.bottomtext}>{ongoingOrdersCount}</Text>
        </View>
        <View style={styles.middleSectionText}>
          <Text style={styles.toptext}>Approved Trips</Text>
          <Text style={styles.bottomtext}>{closedOrdersCount}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    marginTop: 20,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 50,
    marginBottom: 5,
  },
  middleSectionTextContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  middleSectionText: {
    justifyContent: "center",
    alignItems: "center",
  },
  toptext: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "bold",
  },
  bottomtext: {
    fontSize: 24,
    color: Colors.darkGray,
    fontWeight: "800",
  },
});
