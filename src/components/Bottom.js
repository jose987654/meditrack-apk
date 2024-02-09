import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import Sizes from "../constants/Sizes";
import Card from "../constants/Card";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Bottom() {
  const navigation = useNavigation();
  
const navigateToOrderScreen = () => {
  navigation.navigate('OrderScreen');
};

const navigateToApprovedScreen = () => {
  navigation.navigate('ApprovedScreen');
};
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
          cardTextOne="0 Trips"
          cardText="My Trips"
          Reviewed="Traveled"
          style={{ backgroundColor: Colors.primary}}
          onPressFunction={navigateToOrderScreen} 
        />
        <Card
          icon={
            <FontAwesome name="check" size={24} color={"green"} />
          }
          cardTextOne="0 miles"
          cardText="Approved Mileage"
          Reviewed="Approved"
          style={{ backgroundColor: "lightgreen" }}
          onPressFunction={navigateToApprovedScreen} 
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
