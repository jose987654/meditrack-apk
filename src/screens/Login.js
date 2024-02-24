import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
  ImageBackground,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { authInstance } from "../../firebaseConfig";
// import { signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { getDocs, collection, deleteDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

import {
  Layout,
  Text,
  TextInput,
  Button,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import FlashMessage, { showMessage } from "react-native-flash-message";
import Icon from "react-native-vector-icons/Ionicons"; // Import the icon component
import { Input } from "react-native-elements";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  async function login() {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Signed in
      const user = userCredential.user;
      await AsyncStorage.setItem("isLoggedIn", "true"); // AsyncStorage only supports string values
      // console.log(user); // Log user value
      await AsyncStorage.setItem("user", JSON.stringify(user));
      showMessage({
        message: "Success!",
        description: "You have successfully Signed in.",
        type: "success",
        duration: 1000,
      });

      navigation.navigate("MainTabs"); // Navigate to "MainTabs"
    } catch (error) {
      console.log(error);
      alert(errorMessage);
      // Handle errors here
    }
    setLoading(false);
  }

  return (  
      <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
        <Layout>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: isDarkmode ? "#17171E" : themeColor.white100,
              }}
            >
              <Image
                resizeMode="contain"
                style={{
                  height: 220,
                  width: 220,
                }}
                source={require("../../assets/login.png")}
              />
            </View>
            <View
              style={{
                flex: 3,
                paddingHorizontal: 20,
                paddingBottom: 20,
                backgroundColor: isDarkmode
                  ? themeColor.dark
                  : themeColor.white,
              }}
            >
              <Text
                fontWeight="bold"
                style={{
                  alignSelf: "center",
                  padding: 30,
                }}
                size="h3"
              >
                Login, Medi-Track
              </Text>
              <Text>Email Address</Text>
              <TextInput
                containerStyle={{ marginTop: 15 }}
                placeholder="Enter your email-address..."
                value={email}
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={(text) => setEmail(text)}
              />

              <Text style={{ marginTop: 15 }}>Password</Text>
              <Input
                containerStyle={{ marginTop: 15, width: "105%", marginLeft: 0 }}
                placeholder="Enter your password..."
                value={password}
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                secureTextEntry={!isPasswordVisible}
                onChangeText={(text) => setPassword(text)}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    <Icon
                      name={isPasswordVisible ? "eye" : "eye-off"}
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                }
                inputContainerStyle={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 10,
                }}
              />
              <Button
                text={loading ? "Loading" : "Continue"}
                onPress={() => {
                  login();
                }}
                style={{
                  marginTop: 20,
                }}
                disabled={loading}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 15,
                  justifyContent: "center",
                }}
              >
                <Text size="md">Don't have an account?</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Register");
                  }}
                >
                  <Text
                    size="md"
                    fontWeight="bold"
                    style={{
                      marginLeft: 5,
                    }}
                  >
                    Register here
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("ForgetPassword");
                  }}
                >
                  <Text size="md" fontWeight="bold">
                    Forgot password
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 30,
                  justifyContent: "center",
                }}
              >
                {/* <TouchableOpacity
                onPress={() => {
                  isDarkmode ? setTheme("light") : setTheme("dark");
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  {isDarkmode ? "☀️ light theme" : "🌑 dark theme"}
                </Text>
              </TouchableOpacity> */}
              </View>
            </View>
          </ScrollView>
        </Layout>
      </KeyboardAvoidingView>
    
  );
}
