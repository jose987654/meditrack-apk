import React, { useState } from "react";
import { Text, Button, Alert, ActivityIndicator, View,TouchableOpacity, } from "react-native";
import * as Updates from "expo-updates";
import NetInfo from "@react-native-community/netinfo";
import { showMessage, hideMessage } from "react-native-flash-message";
export default function AppUpdate() {
//   const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleUpdatePress = async () => {
    try {
      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        showMessage({
          message: "No Internet Connection",
          description: "Please check your internet connection.",
          type: "danger",
          duration: 2000,
        });
      } else {
        hideMessage();
      }
      setIsLoading(true);
      const { isAvailable } = await Updates.checkForUpdateAsync();
    //   setUpdateAvailable(isAvailable);
      if (isAvailable) {
        Alert.alert(
          "Update Available",
          "A new version of the app is available. Do you want to update?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Update", onPress: updateApp },
          ]
        );
      } else {
        Alert.alert("No Updates", "Your app is already up to date.");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking for updates:", error);
    }
  };

  const updateApp = async () => {
    try {
      await Updates.fetchUpdateAsync();
      showMessage({
        message: "Success!",
        description: "You have Updated succesfully.",
        type: "success",
        duration: 2000,
      });
      Alert.alert("Update", "App has been updated. Please restart the app.", [
        { text: "Restart", onPress: () => Updates.reloadAsync() },
      ]);
    } catch (error) {
      console.error("Error updating app:", error);
    }
  };
  const CustomButton = ({ title, onPress, isLoading }) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: isLoading ? '#fff' : '#fff',
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 50,
        
        }}
        onPress={onPress}
        disabled={isLoading}
      >
        <Text style={{ color: 'rgba(0,0,0,0.5)', marginRight: 5 }}>{isLoading ? "Updating..." : title}</Text>
        {isLoading && <ActivityIndicator size="small" color="#1D0776" />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ alignItems: 'center', marginTop: 10 }}>
      <CustomButton
        title="Update App"
        onPress={handleUpdatePress}
        isLoading={isLoading}
      />
    </View>
  );
}
