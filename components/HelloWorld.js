import React, { useState, useEffect } from 'react';
import {View, Text, StatusBar, StyleSheet, TouchableOpacity, Image, Dimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkTokenExpiration } from './auth/authUtils'; 


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function HelloWorldScreen() {
  useEffect(() => {
    handleTokenExpiration();
  }, []);

  const [name, setName] = useState("World")

  useEffect(() => {
    const getName = async () => {
      const name = await AsyncStorage.getItem('firstname');
      setName(name);
    };
    getName();
  }, [AsyncStorage.getItem('firstname')]);

  const handleTokenExpiration = async () => {
    const isTokenValid = await checkTokenExpiration();

    if (!isTokenValid) {
      navigation.navigate('Welcome');
    } else {
      navigation.navigate('HelloWorld');
    }
  };
  
    const navigation = useNavigation();
    const handleTextPress = () => {
      if (AsyncStorage.getItem('token') !== null) {
        navigation.navigate('Fortune');
      }
      else {
        navigation.navigate('Welcome');
      }
    };
  
    return (
      <View style={styles.container}>
        
        <Text style={styles.text}> Hello,</Text>
        <Text style={styles.text}>{name}</Text>
        <TouchableOpacity onPress={handleTextPress}>
        <Image
            source={require('./../assets/gifs/tv.gif')}
            style={styles.gif}
            autoplay
            loop
          />
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    gifContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    gif: {
      width: windowWidth * 0.6,
      height: windowHeight * 0.4, 
    },
    text: {
      fontFamily: 'press-start',
      fontSize: 35,
      textAlign: 'center',
      lineHeight: 50,
    },
  });
  
  export default HelloWorldScreen;