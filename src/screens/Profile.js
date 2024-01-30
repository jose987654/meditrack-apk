import React from "react";
import { View } from "react-native";
import { Layout, Text } from "react-native-rapi-ui";

import { StyleSheet, ImageBackground } from "react-native";
import Top from "../components/Top";
import Middle from "../components/Middle";
import Bottom from "../components/Bottom";
import Sizes from "../constants/Sizes";
export default function ({ navigation }) {
  return (
    <Layout>
      {/* <View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Text>This is the Profile tab</Text>
			</View> */}
      <>
        <ImageBackground
          style={styles.backgroundImage}
          source={require("../../assets/bg.png")}
          // blurRadius={1}
        >
          <View style={styles.container}>
            <Top />
            <Middle />
            <Bottom />
          </View>
        </ImageBackground>
      </>
    </Layout>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    marginHorizontal: Sizes.medium,
    marginTop: Sizes.safe,
  },
});
