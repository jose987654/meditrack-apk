import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import Sizes from "../constants/Sizes";
import Card from "../constants/Card";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

export default function Bottom() {
  return (
    <View style={styles.bottomContainer}>
      <Text style={{ fontSize: 20, color: Colors.white, fontWeight: "bold" }}>
        Mileage Approval Status
      </Text>

      <View style={styles.completeContainer}>
        <Card
          icon={
            <FontAwesome
              name="spinner"
              size={24}
              color={"#102294"}
            />
          }
          cardTextOne="242"
          cardText="My Trips"
          Reviewed="Traveled"
          style={{ backgroundColor: Colors.primary}}
        />
        <Card
          icon={
            <FontAwesome name="check" size={24} color={"green"} />
          }
          cardTextOne="1,552 miles"
          cardText="Approved Mileage"
          Reviewed="Approved"
          style={{ backgroundColor: "lightgreen" }}
        />
      </View>

      {/* <View style={styles.bottomSection}>
        <Text style={styles.bottomSectionText}>Buy Pro $23.49</Text>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    marginTop: Sizes.medium,
  },
  completeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Sizes.xs,
  },
  card: {
    backgroundColor: Colors.secondary,
  },
  bottomSection: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: Sizes.medium,
  },
  bottomSectionText: {
    fontWeight: "bold",
    fontSize: Sizes.smedium,
    color: Colors.darkGray,
    borderBottomWidth: 1,
    marginBottom: 5,
    borderBottomColor: Colors.darkGray,
  }
});
