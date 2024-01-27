import React from "react";
import FlashMessage from "react-native-flash-message";
import AppNavigator from "./src/navigation/AppNavigator";
import { ThemeProvider } from "react-native-rapi-ui";
export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
      <FlashMessage position="top" />
    </ThemeProvider>
  );
}
