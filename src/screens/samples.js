import React, { useState, useContext } from "react";
import { View, ScrollView } from "react-native";
import { Layout, Text, TopNav } from "react-native-rapi-ui";
import { HospitalDataContext } from "../contexts/hospitalContext";
import { FlatList, TouchableOpacity, TextInput, Button } from "react-native";
import { SearchBar, Icon } from "react-native-elements";
// import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

export default function ({ navigation }) {
  const { hospitalData, SamplesData, fetchData } =
    useContext(HospitalDataContext);
  const [search, setSearch] = useState("");
  //   const [sorted, setSorted] = useState(false);
  //   const [sortedData, setSortedData] = useState([...samplesData]);

  const updateSearch = (search) => {
    // setSorted(false);
    setSearch(search);
  };

  const filteredData = SamplesData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  const [quantities, setQuantities] = useState({}); // Add this line

  const updateQuantity = (id, value) => {
    // Add this function
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const anyQuantityExists = Object.values(quantities).some((qty) => qty > 0); // Modify this line

  return (
    <Layout>
      <TopNav
        middleContent="Samples List"
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
        <SearchBar
          placeholder="Search Samples..."
          onChangeText={updateSearch}
          value={search}
          lightTheme
          round
          containerStyle={{
            backgroundColor: "transparent",
            borderBottomColor: "transparent",
            borderTopColor: "transparent",
          }}
          inputStyle={{ color: "#333" }}
        />
        {/* <ScrollView contentContainerStyle={{ flexGrow: 1 }}> */}
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}

         keyboardShouldPersistTaps="handled"    ListHeaderComponent={ // Add this prop
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                    backgroundColor: "#fff",
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: 'bold',paddingHorizontal:10 }}>Sample</Text>
                  <Text style={{ fontSize: 20, fontWeight: 'bold',paddingHorizontal:10 }}>Qty</Text>
                </View>
              }
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6, // Increase marginBottom
                  backgroundColor: "#fff",
                  padding: 10, // Increase padding
                  borderRadius: 10, // Increase borderRadius
                }}
                // onPress={() => navigation.navigate("MapsScreen")}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <Icon
                    name="hospital-o"
                    type="font-awesome"
                    size={24}
                    color="#333"
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
                    {item.name}
                  </Text>
                  <TextInput
                    style={{
                      width: 60, // Increase width
                      height: 50, // Increase height
                      borderColor: "gray",
                      borderWidth: 1,
                      borderRadius: 5, // Add border radius
                      padding: 4, // Add padding
                      fontSize: 18, // Increase font size
                      textAlign: "center", // Center the text
                    }}
                    onChangeText={(text) => updateQuantity(item.id, text)}
                    value={quantities[item.id]}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            )}
            removeClippedSubviews={true}
          />
          <View
  style={{
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  }}
>
<TouchableOpacity
  style={{
    backgroundColor: anyQuantityExists ? '#841584' : '#cccccc', // Change color based on disabled state
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center', borderRadius: 10, 
    width: '100%', // This will make the button take up the full width of its parent
  }}
  disabled={!anyQuantityExists}
  onPress={() => navigation.navigate("MapsScreen")}
>
  <Text style={{ color: '#fff', fontSize: 18 }}>Confirm</Text>
</TouchableOpacity>
</View>

        {/* </ScrollView> */}
      </View>
    </Layout>
  );
}
