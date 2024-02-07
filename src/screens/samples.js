import React, { useState, useContext } from "react";
import { View, ScrollView } from "react-native";
import { Layout, Text, TopNav } from "react-native-rapi-ui";
import { HospitalDataContext } from "../contexts/hospitalContext";
import { FlatList, TouchableOpacity, TextInput } from "react-native";
import { SearchBar, Icon } from "react-native-elements";
import { Modal, Button } from "react-native";
import { SelectedHospitalContext } from "../contexts/locationsContext";
// import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

export default function ({ navigation }) {
  const { hospitalData, SamplesData, fetchData } =
    useContext(HospitalDataContext);
  const [search, setSearch] = useState("");
  //   const [sorted, setSorted] = useState(false);
  //   const [sortedData, setSortedData] = useState([...samplesData]);
  const { setSamples } = useContext(SelectedHospitalContext);
  const updateSearch = (search) => {
    // setSorted(false);
    setSearch(search);
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tempQuantity, setTempQuantity] = useState("");

  const filteredData = SamplesData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  const [quantities, setQuantities] = useState({}); // Add this line

  const updateQuantity = (item, value) => {
    setQuantities((prev) => ({ ...prev, [item.id]: { item, quantity: value } }));
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
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={true}
          ListHeaderComponent={
            // Add this prop
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
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  paddingHorizontal: 10,
                }}
              >
                Sample
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  paddingHorizontal: 1,
                }}
              >
                Quantity
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
                backgroundColor: "#fff",
                padding: 10,
                borderRadius: 10,
              }}
              onPress={() => {
                setSelectedItem(item);
                setTempQuantity(quantities[item.id] || "");
                setModalVisible(true);
              }}
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
                    width: 120,
                    height: 50,
                    borderColor: "gray",
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 4,
                    fontSize: 20,
                    textAlign: "center",
                    color: "#000",
                  }}
                  value={quantities[item.id]}
                  editable={false}
                />
              </View>
            </TouchableOpacity>
          )}
        />
        {modalVisible && (
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 20,
                    borderRadius: 10,
                    width: "80%",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.4,
                    shadowRadius: 4.65,
                    elevation: 8,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      padding: 10,
                      borderRadius: 5,
                      backgroundColor: "#f0f0f0",
                    }}
                    onPress={() => {
                      setModalVisible(false);
                    }}
                  >
                    <Text style={{ fontSize: 18, color: "#333" }}>X</Text>
                  </TouchableOpacity>
                  <Text style={{ fontSize: 24, marginBottom: 4 }}>
                    {selectedItem?.name}{" "}
                  </Text>

                  <Text style={{ fontSize: 20, marginBottom: 20 }}>Qty.</Text>

                  <TextInput
                    style={{
                      width: "100%",
                      height: 50,
                      borderColor: "gray",
                      borderWidth: 1,
                      borderRadius: 5,
                      padding: 10,
                      fontSize: 18,
                      textAlign: "center",
                      marginBottom: 20,
                    }}
                    onChangeText={setTempQuantity}
                    value={tempQuantity}
                    placeholder="Enter Sample Quantity ..."
                    keyboardType="numeric"
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      width: "100%",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        updateQuantity(selectedItem, tempQuantity);
                        setModalVisible(false);
                      }}
                      style={{
                        backgroundColor: "#000080",
                        padding: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        width: "40%",
                        borderRadius: 5,
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 18 }}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            margin: 20,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: anyQuantityExists ? "#841584" : "#cccccc", // Change color based on disabled state
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              width: "100%", // This will make the button take up the full width of its parent
            }}
            disabled={!anyQuantityExists}
            onPress={() => {
              // navigation.navigate("MapsScreen");
              // setQuantities({}); // Clear quantities
              // setSamples(quantities);
              console.log("qty ",quantities)
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
}
