import React, { useState, useContext, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Layout, Text } from "react-native-rapi-ui";
import { HospitalDataContext } from "../contexts/hospitalContext";
import { FlatList, TouchableOpacity } from "react-native";
import { SearchBar, Icon } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";

export default function ({ navigation }) {
  const { hospitalData, SamplesData, fetchData } = useContext(HospitalDataContext);
  const [search, setSearch] = useState("");
  const [sorted, setSorted] = useState(false);
  const [sortedData, setSortedData] = useState([...hospitalData]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [loading, setLoading] = useState(true);

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
  useEffect(() => {
    if (hospitalData.length === 0) {
      setLoading(true);
      fetchData(); // Fetch the hospital data
    } else {
      setLoading(false);
    }
  }, [hospitalData, fetchData]);

  return (
    <Layout>
      <View
        style={{ flex: 1, marginHorizontal: 20, backgroundColor: "#f5f5f5" }}
      >
      
          <>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                marginBottom: 10,
                color: "#333",
              }}
            >
              Hospital List
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
              {loading ? (
          <View
          style={{
            flex: 1,
            justifyContent: 'center', // Center vertically
            alignItems: 'center', // Center horizontally
            backgroundColor: "#f5f5f5",
          }}
        >
          <ActivityIndicator size={60} color="#3350FF" />
        </View>
        ) : (<>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 5,
                marginBottom: 10,
              }}
            >
              <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue) => {
                  if (itemValue !== null) {
                    sortData(itemValue);
                  }
                }}
              >
                <Picker.Item label="Sort By :" value={null} />
                <Picker.Item label="Sort by Name A-Z" value="AZ" />
                <Picker.Item label="Sort by Name Z-A" value="ZA" />
              </Picker>
            </View>
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
                  }}
                  onPress={() =>
                    navigation.navigate("DestinationScreen", {
                      hospitalId: item.id,
                    })
                  }
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
                  </View>
                  <Icon
                    name="chevron-right"
                    type="font-awesome"
                    size={24}
                    color="#333"
                  />
                </TouchableOpacity>
              )}
              removeClippedSubviews={true}
            /></>)}
          </>
        
      </View>
    </Layout>
  );
}
