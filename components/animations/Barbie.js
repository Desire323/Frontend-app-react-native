import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image, Dimensions } from 'react-native';
import MovingImage from './MovingImage';

const Barbie = () => {
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
    startFadingAnimation() 
    }, 500);
  }, []);

  const startFadingAnimation = () => {
    Animated.sequence([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 0.8,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      startFadingAnimation();
    });
  };

  return (
    <View style={styles.container}>
      
      <Animated.View style={{ opacity: fadeAnimation }}>
        <Image
          source={require('./../../assets/images/barbiePixel.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
      <MovingImage/>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 100,
  },
  image: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: Dimensions.get('window').width / 1.25,
    height: Dimensions.get('window').width / 2,
  },
});

export default Barbie;
