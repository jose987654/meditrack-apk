// CustomSplashScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, Image, ImageBackground } from "react-native";
// import { useFonts } from "expo-font";
// import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const CustomSplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      // Check the stored login status
      // const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

      const isLoggedInString = await AsyncStorage.getItem("isLoggedIn");
      const isLoggedIn = isLoggedInString === "true"; // Parse as boolean

      const timeout = setTimeout(() => {
        // Navigate based on the login status
        if (isLoggedIn) {
          // navigation.navigate("HomeScreen");
          navigation.navigate("MainTabs");
          //   console.log("true");HomeScreenTab
        } else {
          //   console.log("false");
          navigation.navigate("Login");
        }

        setShowSplash(false);
      }, 2000);

      return () => clearTimeout(timeout);
    };

    checkLoginStatus();
  }, [navigation]);
  //   const [loaded] = useFonts({
  //     MeriendaOne: require("../assets/Fonts/MeriendaOne-Regular.ttf"),
  //   });

  //   if (!loaded) {
  //     return null; // Render a loading component or nothing if fonts are not yet loaded
  //   }

  return (
    showSplash && (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <View style={{ flexDirection: "col", alignItems: "center" }}>
          {/* <ImageBackground
            source={require("../../assets/logo11.png")}
            style={{ width: 230, height: 290, marginRight: 16 }}
          /> */}
          <Text
            style={{
              //   fontFamily: "Arial", // Change this to your preferred font family
              fontStyle: "normal",
              fontWeight: "bold", // Makes the text bold
              fontSize: 60, // Increase the font size
              color: "#3350FF", // Lighter red
              textAlign: "center", // Center align text
              lineHeight: 90, // Increase line height for better readability
            }}
          >
            Medi-Track
          </Text>
        </View>
        <View>
          <Image
            resizeMode="contain"
            style={{
              height: 220,
              width: 220,
            }}
            source={require("../../assets/logo2.png")}
          />
        </View>
      </View>
    )
  );
};

export default CustomSplashScreen;
