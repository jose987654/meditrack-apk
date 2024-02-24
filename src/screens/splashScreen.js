
import React, { useEffect, useState } from "react";
import { View, Text, Image, ImageBackground, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { showMessage } from "react-native-flash-message";
import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";

const CustomSplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigation = useNavigation();
  const fadeIn = new Animated.Value(0);
 
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
          showMessage({
            message: 'No Internet Connection',
            description: 'Please check your internet connection.',
            type: 'danger',
          });
          // Alert.alert(
          //   'No Internet Connection',
          //   'Please check your internet connection and try again.',
          //   [{ text: 'OK', onPress: () => {} }]
          // );
          return;
        }

        const isLoggedInString = await AsyncStorage.getItem('isLoggedIn');
        const isLoggedIn = isLoggedInString === 'true';

        const timeout = setTimeout(() => {
          if (isLoggedIn) {
            navigation.navigate('MainTabs');
          } else {
            navigation.navigate('Login');
          }
          setShowSplash(false);
        }, 2000);

        return () => clearTimeout(timeout);
      } catch (error) {
        console.error('Error occurred while checking internet connectivity:', error);
        // Handle error gracefully, possibly retry or show appropriate message to the user
      }
    };

    checkLoginStatus();
  }, [navigation]);
  useEffect(() => {
    // Fade-in animation for logo
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 1500, // Adjust duration as needed
      useNativeDriver: true,
    }).start();
  }, []);
  
  return (
    showSplash && (
      <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={["rgba(109, 192, 255, 0.7)", // Lighter blue color with opacity
        "rgba(174, 223, 255, 0.7)"]} // Updated transparent gradient colors
        style={styles.background}
      >
        {/* App Name */}
        <Text style={[styles.appName,]}>Medi-Track</Text>

        {/* Animated Logo */}
        <Animated.View style={{ opacity: fadeIn }}>
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={require("../../assets/logo2.png")}
          />
        </Animated.View>
      </LinearGradient>
    </View>
    )
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  appName: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  logo: {
    height: 120,
    width: 120, borderRadius: 10,
  },
});
export default CustomSplashScreen;
