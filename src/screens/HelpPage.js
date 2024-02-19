import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { Card } from "react-native-elements";

const HelpPage = () => {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(true);
  const [navVisible, setnavVisible] = useState(false);
  // const handleLogOut = () => {
  //   navigation.navigate("LoginScreen");
  // };

  const handleSendFeedback = () => {
    const email = "mwangiwanganga@gmail.com";
    const subject = "Feedback for Application";
    const body = "Please share your feedback here: ";
    const emailUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    Linking.openURL(emailUrl).catch((err) =>
      console.error("An error occurred:", err)
    );
  };

  const handleReportProblem = () => {
    const email = "mwangiwanganga@gmail.com";
    const subject = "Report Problem ";
    const body = "Please share your Problem here: ";
    const emailUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    Linking.openURL(emailUrl).catch((err) =>
      console.error("An error occurred:", err)
    );
  };

  const handleCall = () => {
    const phoneNumber = "+256708627386";
    const callUrl = `tel:${phoneNumber}`;
    Linking.openURL(callUrl).catch((err) =>
      console.error("An error occurred:", err)
    );
  };

  const handleText = () => {
    const phoneNumber = "+256708627386";
    const textUrl = `sms:${phoneNumber}`;
    Linking.openURL(textUrl).catch((err) =>
      console.error("An error occurred:", err)
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome5 name="arrow-left" size={20} color="#1D0776" />
          </TouchableOpacity>
          <Text style={styles.title}>Help</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title2}>Here to help.</Text>
          <Card
            containerStyle={{
              borderRadius: 10,
              margin: 0,
              marginBottom: 20,
              // paddingBottom: 30,
            }}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardInfo}>
                <TouchableOpacity
                  style={styles.infoItem}
                  activeOpacity={0.9}
                  onPress={() => handleReportProblem()}
                >
                  <FontAwesome5
                    name="exclamation-triangle"
                    size={20}
                    color="#8B0000"
                    style={styles.icon}
                  />
                  <Text style={styles.cardTitle}>Report Problem.</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
          <Card
            containerStyle={{
              borderRadius: 10,
              margin: 0,
              marginBottom: 20,
              // paddingBottom: 30,
            }}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardInfo}>
                <TouchableOpacity
                  style={styles.infoItem}
                  activeOpacity={0.9}
                  onPress={() => handleSendFeedback()}
                >
                  <FontAwesome5
                    name="envelope"
                    size={20}
                    color="#1D0776"
                    style={{ ...styles.icon, transform: [{ scaleX: -1 }] }}
                  />
                  <Text style={styles.cardTitle}>Send Feedback.</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
          <Card
            containerStyle={{
              borderRadius: 10,
              margin: 0,
              marginBottom: 20,
              // paddingBottom: 30,
            }}
          >
            <View style={styles.cardInfo}>
              <TouchableOpacity
                style={styles.infoItem}
                activeOpacity={0.9}
                onPress={() => handleText()}
              >
                <FontAwesome5
                  name="comment"
                  size={20}
                  color="#1D0776"
                  style={{ ...styles.icon, transform: [{ scaleX: -1 }] }}
                />
                <Text style={styles.cardTitle}>Text Us.</Text>
              </TouchableOpacity>
            </View>
          </Card>
          <Card
            containerStyle={{
              borderRadius: 10,
              margin: 0,
              // marginBottom: 10,
              // paddingBottom: 30,
            }}
          >
            <View style={styles.cardInfo}>
              <TouchableOpacity
                style={styles.infoItem}
                activeOpacity={0.9}
                onPress={() => handleCall()}
              >
                <FontAwesome5
                  name="phone"
                  size={20}
                  color="#1D0776"
                  style={{ ...styles.icon, transform: [{ scaleX: -1 }] }}
                />
                <Text style={styles.cardTitle}>Call Tech. Support.</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    // marginTop: 30,
  },
  logoutButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    alignItems: "center",
    // marginTop: 20,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    paddingBottom: 20,
    width: "100%",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1D0776",
    paddingLeft: 5,
  },
  title2: {
    fontSize: 24,
    fontWeight: "400",
    color: "#1D0776",
    paddingLeft: 5,
    paddingBottom: 10,
  },
  card: {
    // flex: 1.0,
    // backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    // shadowColor: 'black',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 3,
    width: "100%",
    justifyContent: "center",
  },
  cardContent: {
    // flex: 1,
    justifyContent: "center",
  },
  userContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  enclosedUserIcon: {
    borderRadius: 100, // Enclose the user icon
    backgroundColor: "lightblue",
    padding: 20,
  },
  userIcon: {
    fontSize: 60,
    color: "#1D0776",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#1D0776",
  },
  cardInfo: {
    // borderTopWidth: 1,
    // borderTopColor: '#ccc',
    paddingTop: 10,
  },
  infoItem: {
    flexDirection: "row",
    // justifyContent: 'space-between',
    // borderWidth: 1,
    // borderBottomColor: "#1D0776",
    padding: 10,
    gap: 20,
  },
  label: {
    fontSize: 19,
    fontWeight: "300",
    color: "grey",
  },
  value: {
    fontSize: 24,
    fontWeight: "500",
    color: "#1D0776",
  },
});

export default HelpPage;
