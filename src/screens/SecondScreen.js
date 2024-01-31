import React from "react";
import { View } from "react-native";
import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import OrdersComponent from "./Orders";
export default function ({ navigation }) {
  const { isDarkmode } = useTheme();
  return (
    <Layout>
      <TopNav
        middleContent="My Trips "
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : "#191921"}
          />
        }
        leftAction={() => navigation.goBack()}
      />
      <View
        style={{
          flex: 1,
          // alignItems: "center",
          // justifyContent: "center",
        }}
      >
        {/* This text using ubuntu font */}
        {/* <Text fontWeight="bold">This is my Trips screen</Text> */}
        <OrdersComponent />
      </View>
    </Layout>
  );
}
