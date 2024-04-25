import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
  ImageBackground,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  Layout,
  Text,
  TextInput,
  Button,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Import your Firestore instance
import Icon from "react-native-vector-icons/Ionicons"; // Import the icon component
import { Input } from "react-native-elements";
import FlashMessage, { showMessage } from "react-native-flash-message";
export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
 
  async function register() {
    setLoading(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Registered
        const user = userCredential.user;
        console.log(user); // Log user value
        try {
          await updateProfile(user, {
            displayName: `${firstName} ${lastName}`,
          });
          console.log("Update successful");
        } catch (error) {
          console.error("Update failed: ", error);
        }
        showMessage({
          message: "Success!",
          description: "You have successfully Signed Up.",
          type: "success",
          duration: 2500,
        });
        setTimeout(() => {
          navigation.navigate("Login"); // Navigate to "Login"
          setLoading(false);
        }, 2500);
        setLoading(false);
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        setErrorMessage(errorMessage);
            // ...
        console.log(error);
        // console.log(errorMessage);
        setLoading(false);
        showMessage({
          message: "Error!",
          description: errorCode,
          type: "danger",
          duration: 50000,
        });
      });
  }

  return (
    <ImageBackground
      source={require("../../assets/bg.png")}
      style={{ flex: 1 }}
    >
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
                  height: 100,
                  width: 220,
                }}
                source={require("../../assets/register.png")}
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
                size="h3"
                style={{
                  alignSelf: "center",
                  padding: 30,
                }}
              >
                SignUp, Medi-Track
              </Text>
              {errorMessage && (
              <View
                style={{
                  alignSelf: "center",
                  backgroundColor: "#ffe6e6",
                  borderRadius: 5,
                  padding: 20,
                  margin: 10,
                }}
              >
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  {errorMessage}
                </Text>
              </View>
            )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text>First Name</Text>
                  <TextInput
                    containerStyle={{ marginTop: 15 }}
                    placeholder="First Name"
                    value={firstName}
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
                    keyboardType="default"
                    onChangeText={(text) => setFirstName(text)}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text>Last Name</Text>
                  <TextInput
                    containerStyle={{ marginTop: 15 }}
                    placeholder="Last Name"
                    value={lastName}
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
                    keyboardType="default"
                    onChangeText={(text) => setLastName(text)}
                  />
                </View>
              </View>
              <Text style={{ marginTop: 15 }}>Email Address</Text>
              <TextInput
                containerStyle={{ marginTop: 15 }}
                placeholder="Enter your email..."
                value={email}
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={(text) => setEmail(text)}
              />

              <Text style={{ marginTop: 15 }}>Password</Text>
              <Input
                containerStyle={{ marginTop: 15, width: "100%", marginLeft: 0 }}
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
                text={loading ? "Loading" : "Create an account"}
                onPress={() => {
                  register();
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
                <Text size="md">Already have an account?</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Login");
                  }}
                >
                  <Text
                    size="md"
                    fontWeight="bold"
                    style={{
                      marginLeft: 5,
                    }}
                  >
                    Login here
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
    </ImageBackground>
  );
}
