import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fortune_random} from './api/fortune_api';
import Animation from './animations/Animation';
import StyleManager from './animations/styles/StyleManager';
import { checkTokenExpiration } from './auth/authUtils';

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
    const response = await fortune_random(token);

    if(typeof response === 'object' && response.status === 500){
      await AsyncStorage.removeItem('token')
      navigation.navigate("Welcome")
    }
  
    if(response){
      setAnimation(true);
      setTheme(response.theme);
      setFortune(response.wish);
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
