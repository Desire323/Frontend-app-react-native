import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, Dimensions } from 'react-native';



const MovingImage = () => {  
  const moveAnimation = useRef(new Animated.Value(-400)).current;
  useEffect(() => {
    startMovingAnimation();
  }, []);

  const startMovingAnimation = () => {
    Animated.timing(moveAnimation, {
      toValue: Dimensions.get('window').width + 100, // Adjust this value to control the final position
      duration: 4000, // Duration of the animation in milliseconds
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.imageContainer, { transform: [{ translateX: moveAnimation }] }]}>
        <Image
          source={require('./../assets/images/barbievette.png')}
          style={styles.image}
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
  // imageContainer: {
  //   position: 'absolute',
  //   top: Dimensions.get('window').height / 2 - 50, // Adjust this value to position the image vertically
  // },
  image: {
    width: Dimensions.get('window').width / 1.25,
    height: Dimensions.get('window').width / 2,
  },
});

export default MovingImage;
