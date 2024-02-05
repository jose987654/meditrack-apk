import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';

export default function TripScreen() {
  const [tripStarted, setTripStarted] = useState(false);
  const pulseAnimation = new Animated.Value(0);
  const pulseAnimation2 = new Animated.Value(0);
  const pulseAnimation3 = new Animated.Value(0);

  const handlePress = () => {
    setTripStarted(!tripStarted);
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation2, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation2, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation3, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation3, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rider Trip</Text>
      <Image 
        style={styles.image}
        source={require("../../assets/rider1.jpg")}
      />
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        {/* <Animated.View
          style={{
            position: 'absolute',
            opacity: pulseAnimation3,
            transform: [{ 
              scale: pulseAnimation3.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 3]
              }) 
            }],
            backgroundColor: 'transparent',
            borderColor: '#841584',
            borderWidth: 2,
            borderRadius: 100,
            width: 100,
            height: 100,
          }}
        /> */}
        {/* <Animated.View
          style={{
            position: 'absolute',
            opacity: pulseAnimation2,
            transform: [{ 
              scale: pulseAnimation2.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 2]
              }) 
            }],
            backgroundColor: 'transparent',
            borderColor: 'green',
            borderWidth: 2,
            // borderRadius: 100,
            width: 80,
            height: 30,
          }}
        /> */}
        <Animated.View
          style={{
            transform: [{ 
              scale: pulseAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.2]
              }) 
            }],
          }}
        >
          <TouchableOpacity style={tripStarted ? styles.stopButton : styles.startButton} onPress={handlePress}>
            <Text style={styles.buttonText}>{tripStarted ? 'Stop Trip' : 'Start Trip'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  image: {
    width: "70%",
    height: "50%",
    marginBottom: 20, 
  },
  startButton: {
    backgroundColor: 'green',
    padding: 10,
    margin: 10,
  },
  stopButton: {
    backgroundColor: 'red',
    padding: 10,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});