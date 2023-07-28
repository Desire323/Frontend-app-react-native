import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fortune_random, fortune_history_last} from './api/fortune_api';
import Animation from './animations/Animation';
import StyleManager from './animations/styles/StyleManager';
import { checkTokenExpiration } from './auth/authUtils';
import {isToday} from "./dateTime/DateTimeUtils";

function Fortune() {
  const navigation = useNavigation();
  const [fortune, setFortune] = useState(null);
  const [animation, setAnimation] = useState(false);
  const [theme, setTheme] = useState(null);
  const [styles, setStyles] = useState(StyleManager({theme: theme}));
  
  useEffect(() => {
    handleTokenExpiration();
  }, []);

  useEffect(() => {
    setStyles(StyleManager({ theme: theme }));
  }, [theme]);
  
  const fetchHistory = async () => {
    navigation.navigate("History")
  }

  const handleTokenExpiration = async () => {
    const isTokenValid = await checkTokenExpiration();

    if (!isTokenValid) {
        navigation.navigate('Welcome');
    }};
    

  const fetchFortune = async () => {
    const token = await AsyncStorage.getItem('token');
    const lastReceivedDate = await AsyncStorage.getItem('lastReceivedDate');
    const lastFortune = await AsyncStorage.getItem('lastFortune');

    let response = null;
    if (!lastReceivedDate) {
      try{
        if(lastFortune){
          response = lastFortune;
        }
        else{
          response = await fortune_history_last(token)[0];
        }

        if(response){
          setFortune(response.wish);
          setTheme(response.theme);
          AsyncStorage.setItem('lastReceivedDate', response.date);
        }
      } catch (error) {
        console.log('No history found');
      }
    }
    else if (isToday(lastReceivedDate)) {
      console.log('You already received a fortune today!');
      response = lastFortune;
    }
    else {
      response = await fortune_random(token);
      if(typeof response === 'object' && response.status === 500){
        await AsyncStorage.removeItem('token')
        navigation.navigate("Welcome")
      }
    }
    const responseArr = await fortune_history_last(token);
  response = responseArr[0];
      if(response){
        setAnimation(true);
        setTheme(response.theme);
        setFortune(response.wish);
        AsyncStorage.setItem('lastReceivedDate', (Date.now()).toString());
        setTimeout(() => {
          setAnimation(false);
        }, 3500);
      }
    
  };

  return (
    <View style={styles.container}>
      {fortune ? (
        animation ? 
          <Animation theme={theme}/> 
          :
        <TouchableOpacity onPress={fetchFortune}>
        <Text style={styles.text}>{fortune}</Text>
        </TouchableOpacity>
      ) : (
        <View>
          <TouchableOpacity onPress={fetchFortune}>
            <Text style={styles.question}>?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={fetchHistory}>
            <Text style={StyleSheet.compose(styles.text, {paddingTop:100})}>history</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};



export default Fortune;
