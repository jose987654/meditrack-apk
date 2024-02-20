import React, { useState, useContext } from "react";
import { View, Button } from "react-native";
import { Layout, Text, TopNav } from "react-native-rapi-ui";
import { HospitalDataContext } from "../contexts/hospitalContext";
import { FlatList, TouchableOpacity } from "react-native";
import { SearchBar, Icon } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { SelectedHospitalContext } from "../contexts/locationsContext";
export default function ({ navigation }) {
  const { hospitalData, SamplesData, fetchData, mainHospitalData } =
    useContext(HospitalDataContext);  
  
  const { setDestination } = useContext(SelectedHospitalContext);
//   console.log("hospital main", mainHospitalData);
  
  return (
    <Layout>
      <TopNav
        middleContent="Main Hospitals"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            // color={"000"}
          />
        }
        leftAction={() => navigation.goBack()}
      />
      <View
        style={{ flex: 1, marginHorizontal: 20, backgroundColor: "#f5f5f5" }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 6,
            color: "#1D0776",
          }}
        >
          Main Hospital List
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "200",
            marginBottom: 10,
            color: "#1D0776",
          }}
        >
          *Please select Main Hospital.
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "200",
            marginBottom: 2,
            color: "#1D0776",
          }}
        >
          This is final destination for your samples.
        </Text>
        
        
        <FlatList
          data={mainHospitalData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: 30,
                backgroundColor: "#fff",
                padding: 10,
                borderRadius: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
              onPress={() => {
                Promise.all([
                  setDestination(item),
                  navigation.navigate("SamplesScreen", { hospitalId: item.id }),
                ]);
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <Icon
                  name="hospital-o"
                  type="font-awesome"
                  size={24}
                  color="#1D0776"
                />
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 18,
                    color: "#333",
                    flex: 1,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item?.Endpoint}
                </Text>
              </View>
              <Icon
                name="chevron-right"
                type="font-awesome"
                size={24}
                color="#1D0776"
              />
            </TouchableOpacity>
          )}
          removeClippedSubviews={true}
        />
      </View>
    </Layout>
  );
}
