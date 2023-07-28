import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Bomb = () => {
    const navigation = useNavigation();
  
    // Create an Animated.Value to represent the vertical position of the falling element
    const fallValue = useRef(new Animated.Value(-1000)).current;
    const fadeInOutValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      // Start the fall animation when the component mounts
      startFallAnimation();
    }, []);
  
    const startFallAnimation = () => {
      // Animate the fallValue from its initial position to the bottom of the screen
      Animated.timing(fallValue, {
        toValue: 900, // Adjust this value to control the final position
        duration: 1500, // Adjust the duration of the animation (in milliseconds)
        useNativeDriver: false,
      }).start(() => {
        startFadeInOutAnimation();
      }); // Start the animation
    };

    const startFadeInOutAnimation = () => {
        Animated.timing(fadeInOutValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          // Delay the fade out by 2 seconds
          setTimeout(() => {
            Animated.timing(fadeInOutValue, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }).start();
          }, 1000);
        });
      };
    
  
    return (
        <View style={styles.container}>
          <Animated.View style={[styles.fallingElement, { top: fallValue }]}>
            <Image
              source={require('./../../assets/images/bomb.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </Animated.View>
    
          <Animated.View
            style={[
              styles.fadeInOutImage,
              { opacity: fadeInOutValue, transform: [{ translateY: fadeInOutValue.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] },
            ]}
          >
            <Image
              source={require('./../../assets/images/boom.png')}
              style={styles.boom}
              resizeMode="contain"
            />
          </Animated.View>
        </View>
      );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fadeInOutImage: {
        position: 'absolute',
        bottom: 0, // Position the second image at the bottom of the screen
    },
    fallingElement: {
      position: 'absolute',
      top: 0,
    },
    text: {
      fontFamily: 'press-start',
      fontSize: 30,
    },
    image: {
        width: Dimensions.get('window').width / 2,
        height: Dimensions.get('window').width /3,
    },
    boom: {
        // alignSelf:'flex-end',
        width: Dimensions.get('window').width + 50,
        height: Dimensions.get('window').width,
        // border: 'red',
        // borderWidth: 5,
    },
    
  });
  
  export default Bomb;
    