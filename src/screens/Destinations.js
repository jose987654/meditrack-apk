import React, { useState, useContext } from "react";
import { View,Button } from "react-native";
import { Layout, Text, TopNav } from "react-native-rapi-ui";
import { HospitalDataContext } from "../contexts/hospitalContext";
import { FlatList, TouchableOpacity } from "react-native";
import { SearchBar, Icon } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { SelectedHospitalContext } from "../contexts/locationsContext";
export default function ({ navigation }) {
  const { hospitalData, SamplesData, fetchData } =
    useContext(HospitalDataContext);
  const [search, setSearch] = useState("");
  const [sorted, setSorted] = useState(false);
  const [sortedData, setSortedData] = useState([...hospitalData]);
  const [selectedValue, setSelectedValue] = useState(null);
  const { setDestination } = useContext(SelectedHospitalContext);

  const updateSearch = (search) => {
    setSorted(false);
    setSearch(search);
  };

  const sortData = (value) => {
    let sortedArray = [...hospitalData];
    if (value === "AZ") {
      sortedArray.sort((a, b) => a.name.localeCompare(b.name));
    } else if (value === "ZA") {
      sortedArray.sort((a, b) => b.name.localeCompare(a.name));
    }
    setSortedData(sortedArray);
    setSorted(true);
    setSelectedValue(value);
  };

  const filteredData = hospitalData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <TopNav
        middleContent="Stop Points"
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
          Stop Point List
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "200",
            marginBottom: 2,
            color: "#1D0776",
          }}
        >
          Please pick a stop Point.
        </Text>
        <SearchBar
          placeholder="Search Hospitals..."
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
        <View
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 5,
            marginBottom: 2,
          }}
        >
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue) => {
              if (itemValue !== null) {
                sortData(itemValue);
              }
            }}
            style={{ color: '#1D0776' }}
          >
            <Picker.Item label="Sort By :" value={null} />
            <Picker.Item label="Sort by Name A-Z" value="AZ" />
            <Picker.Item label="Sort by Name Z-A" value="ZA" />
          </Picker>
        </View>
        <TouchableOpacity
  style={{
    backgroundColor: '#1D0776',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 8,
  }}
  onPress={() => navigation.navigate('MainHospitalScreen')}
>
  <Text style={{ color: '#fff', fontSize: 18 }}> Main Hospitals</Text>
</TouchableOpacity>
        <FlatList
          data={sorted ? sortedData : filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
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
                  {item.name}
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
