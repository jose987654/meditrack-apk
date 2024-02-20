import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainHospitals from "../screens/mainHospitals";
import { themeColor, useTheme } from "react-native-rapi-ui";
import TabBarIcon from "../components/utils/TabBarIcon";
import TabBarText from "../components/utils/TabBarText";
import Samples from "../screens/samples";
import Home from "../screens/Home";
import OrderScreen from "../screens/SecondScreen";
import Approved from "../screens/Approved";
import Maps from "../screens/maps";
import About from "../screens/About";
import Profile from "../screens/Profile";
import Login from "../screens/Login";
import ForgetPassword from "../screens/ForgetPassword";
import Register from "../screens/Register";
import Destinations from "../screens/Destinations";
import CustomSplashScreen from "../screens/splashScreen";
import TripScreen from "../screens/tripScreen";
import TripDetails from "../screens/TripDetailScreen";
import HelpPage from "../screens/HelpPage";
import HomeScreenTab from "../screens/HomeTabScreen"
const MainStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeScreen" component={HomeScreenTab} />    
    <HomeStack.Screen name="MainHospitalScreen" component={MainHospitals} />
    <HomeStack.Screen name="Home" component={Home} />
    <HomeStack.Screen name="SamplesScreen" component={Samples} />
    <HomeStack.Screen name="DestinationScreen" component={Destinations} />
    <HomeStack.Screen name="MapsScreen" component={Maps} />
    <HomeStack.Screen name="HelpScreen" component={HelpPage} />   
    <HomeStack.Screen name="ApprovedScreen" component={Approved} />
    <HomeStack.Screen name="OrderScreen" component={OrderScreen} />
    <HomeStack.Screen name="TripScreen" component={TripScreen} />
    <HomeStack.Screen name="Profile" component={Profile} /> 
    <HomeStack.Screen name="TripDetailScreen" component={TripDetails} />
  </HomeStack.Navigator>
);

const ProfileStack = createNativeStackNavigator();
const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="Profile" component={Profile} />       
    <ProfileStack.Screen name="MainHospitalScreen" component={MainHospitals} />
    <ProfileStack.Screen name="HomeScreen" component={HomeScreenTab} />
    <ProfileStack.Screen name="DestinationScreen" component={Destinations} />
    <ProfileStack.Screen name="SamplesScreen" component={Samples} />
    <ProfileStack.Screen name="ApprovedScreen" component={Approved} />
    <ProfileStack.Screen name="OrderScreen" component={OrderScreen} />
    <ProfileStack.Screen name="HelpScreen" component={HelpPage} />
    <ProfileStack.Screen name="MapsScreen" component={Maps} />
    <ProfileStack.Screen name="TripScreen" component={TripScreen} />
    <ProfileStack.Screen name="TripDetailScreen" component={TripDetails} />
  </ProfileStack.Navigator>
);

const AboutStack = createNativeStackNavigator();
const AboutStackScreen = () => (
  <AboutStack.Navigator screenOptions={{ headerShown: false }}>
    <AboutStack.Screen name="OrderScreen" component={OrderScreen} />       
    <AboutStack.Screen name="MainHospitalScreen" component={MainHospitals} />
    <AboutStack.Screen name="DestinationScreen" component={Destinations} />
    <AboutStack.Screen name="HomeScreen" component={HomeScreenTab} />
    <AboutStack.Screen name="SamplesScreen" component={Samples} />
    <AboutStack.Screen name="ApprovedScreen" component={Approved} />
    <AboutStack.Screen name="Profile" component={Profile} />
    <AboutStack.Screen name="MapsScreen" component={Maps} />
    <AboutStack.Screen name="HelpScreen" component={HelpPage} />
    <AboutStack.Screen name="TripScreen" component={TripScreen} />
    <AboutStack.Screen name="TripDetailScreen" component={TripDetails} />
  </AboutStack.Navigator>
);
const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="Splash" component={CustomSplashScreen} />
      <MainStack.Screen name="Login" component={Login} />
      <MainStack.Screen name="ForgetPassword" component={ForgetPassword} />
      <MainStack.Screen name="HomeScreen" component={HomeScreenTab} />
      <MainStack.Screen name="Register" component={Register} />
      <MainStack.Screen name="MainTabs" component={MainTabs} />
      <MainStack.Screen name="SecondScreen" component={OrderScreen} />
      <MainStack.Screen name="DestinationScreen" component={Destinations} />
    </MainStack.Navigator>
  );
};

const Tabs = createBottomTabNavigator();
const MainTabs = () => {
  const { isDarkmode } = useTheme();
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopColor: isDarkmode ? themeColor.dark100 : "#c0c0c0",
          backgroundColor: isDarkmode ? themeColor.dark200 : "#ffffff",
        },
      }}
    >
      {/* these icons using Ionicons */}

      <Tabs.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Home" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"home"} />
          ),
        }}
      />

      <Tabs.Screen
        name="OrderTab"
        component={AboutStackScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Orders" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"information-circle"} />
          ),
        }}
      />
      <Tabs.Screen
        name="ProfileTab"
        component={ProfileStackScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Profile" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"person"} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default () => {
  return (
    <NavigationContainer>
      <Main />
    </NavigationContainer>
  );
};
