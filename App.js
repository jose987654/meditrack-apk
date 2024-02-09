import React from "react";
import FlashMessage from "react-native-flash-message";
import AppNavigator from "./src/navigation/AppNavigator";
import { ThemeProvider } from "react-native-rapi-ui";
import { HospitalDataProvider } from "./src/contexts/hospitalContext"; // Import the provider
import { SelectedHospitalProvider } from "./src/contexts/locationsContext";
import { OrderProvider } from "./src/contexts/orderContext";
export default function App() {
  return (
    <ThemeProvider>
      <OrderProvider>
        <HospitalDataProvider>
          <SelectedHospitalProvider>
            <AppNavigator />
            <FlashMessage position="top" />
          </SelectedHospitalProvider>
        </HospitalDataProvider>
      </OrderProvider>
    </ThemeProvider>
  );
}
