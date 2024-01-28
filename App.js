import React from "react";
import FlashMessage from "react-native-flash-message";
import AppNavigator from "./src/navigation/AppNavigator";
import { ThemeProvider } from "react-native-rapi-ui";
import { HospitalDataProvider } from "./src/contexts/hospitalContext"; // Import the provider

export default function App() {
  return (
    <ThemeProvider>
      <HospitalDataProvider>
        <AppNavigator />
        <FlashMessage position="top" />
      </HospitalDataProvider>
    </ThemeProvider>
  );
}
