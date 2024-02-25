import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { showMessage } from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import AppUpdate from "./update";
export default function Top() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const auth = getAuth();
  async function logout() {
    setLoading(true);
    try {
      await signOut(auth); // Sign out

      await AsyncStorage.setItem("isLoggedIn", "false"); // Set 'isLoggedIn' to 'false'

      showMessage({
        message: "Success!",
        description: "You have successfully Signed out.",
        type: "success",
        duration: 1000,
      });

      navigation.navigate("Login"); // Navigate to "Login"
    } catch (error) {
      console.log(error);
      alert("Error signing out"); // Show error message
    }
    setLoading(false);
  }
  return (
    <>
      <View style={styles.icons}>
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.goBack()} // Add this line to navigate back
        >
          <AntDesign name="arrowleft" size={34} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.setting}
          onPress={async () => {
            console.log("Logout initiated"); // Log message
            await logout(); // Call the logout function
            console.log("Logout successful"); // Log message
          }}
        >
          <AntDesign name="logout" size={22} color="white" />
          <Text
            style={{
              color: "white",
              textAlign: "center",
              paddingHorizontal: 10,
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.icons}>
        <AppUpdate />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  icons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  back: {
    backgroundColor: Colors.alt,
    width: 45,
    height: 45,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  setting: {
    backgroundColor: Colors.alt,
    width: "auto",
    height: 45,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 7,
  },
});
