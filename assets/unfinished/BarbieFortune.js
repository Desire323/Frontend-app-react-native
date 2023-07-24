import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // import from the correct package
import fortune_random from './api/fortune_api';
import Bomb from './Bomb';
import Barbie from './Barbie';
import { Dimensions } from 'react-native';


function Fortune() {
  const navigation = useNavigation();
  const [fortune, setFortune] = useState(null);
  const [bomb, setBomb] = useState(false);
  const [barbie, setBarbie] = useState(false);
  const [color, setColor] = useState("white");
  
  useEffect(() => {
    // setFortune("?");
    // fetchFortune();
  }, []);

  const fetchFortune = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log(`\ntoken: ${token}`);
    const response = await fortune_random(token); // await the asynchronous call
    if(typeof response === 'object' && response !== null)
    {
      AsyncStorage.removeItem('token');
      navigation.navigate('Welcome');
      return;
    }
    console.log(`\nresponse: ${response}`);
    if(response){ //if 200 OK
      setBomb(true);
      setBarbie(true);
      setFortune(response);
      setTimeout(() => {
        setBomb(false);
        setColor("#FF69B4");
        setBarbie(false);
        
      }, 3500);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor:color}]}>
      {/* <View style={{backgroundColor:"blue"}}> */}
      {fortune ? (
        
        <TouchableOpacity onPress={fetchFortune}>
        {barbie ? <Barbie/> :
        <Text style={styles.text}>{"You are Kenough"}</Text>}
        </TouchableOpacity>
        
        // <TouchableOpacity onPress={fetchFortune}>
        // {bomb ? <Bomb/> :
        // <Text style={styles.text}>{"Now I am become death, the destroyer of worlds"}</Text>}
        // </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={fetchFortune}>
        <Text style={styles.question}>?</Text>
        </TouchableOpacity>
      )}
      {/* </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "white",
  },
  text: {
    fontFamily: 'barbie',
    fontSize: 60,
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    paddingHorizontal: 8,
    lineHeight: 80,
  },
  question: {
    fontFamily: 'press-start',
    fontSize: 90,
    alignSelf: 'center',
    textAlign: 'center',
  },
});

export default Fortune;
