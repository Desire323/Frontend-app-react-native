import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // import from the correct package
import fortune_random from './api/fortune_api';
import Animation from './animations/Animation';
import StyleManager from './animations/styles/StyleManager';

function Fortune() {
  const navigation = useNavigation();
  const [fortune, setFortune] = useState(null);
  const [animation, setAnimation] = useState(false);
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    // fetchFortune();
  }, []);

  const fetchFortune = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log(`\ntoken: ${token}`);
    const response = await fortune_random(token); // await the asynchronous call
    // console.log(`\nresponse: ${JSON.stringify(response)}`);

    if(typeof response === 'object' && response.status === 500){
      await AsyncStorage.removeItem('token')
      navigation.navigate("Welcome")
    }
    if(response){ //if 200 OK
      setAnimation(true);
      setTheme(response.theme);
      setFortune(response.wish);
      console.log(`\n\n\nSTYLES: ${JSON.stringify(StyleManager({theme: theme}).text)}`);
      setTimeout(() => {
        setAnimation(false);
      }, 3500);
    }
  };

  return (
    <View style={StyleManager({theme: theme}).container}>
      {fortune ? (
        animation ? 
          <Animation theme={theme}/> 
          :
        <TouchableOpacity onPress={fetchFortune}>
        <Text style={StyleManager({theme: theme}).text}>{fortune}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={fetchFortune}>
        <Text style={StyleManager({theme: theme}).question}>?</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};



export default Fortune;
