import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // import from the correct package
import fortune_random from './api/fortune_api';

function Fortune() {
  const navigation = useNavigation();
  const [fortune, setFortune] = useState(null);

  useEffect(() => {
    fetchFortune();
  }, []);

  const fetchFortune = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log(`\ntoken: ${token}`);
    const response = await fortune_random(token); // await the asynchronous call
    console.log(`\nresponse: ${response}`);
    if(response){ //if 200 OK
      setFortune(response);
    }
  };

  return (
    <View style={styles.container}>
      {fortune ? (
        <TouchableOpacity onPress={fetchFortune}>
        <Text style={styles.text}>{fortune}</Text>
        </TouchableOpacity>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'press-start',
    fontSize: 30,
    alignSelf: 'center',
    textAlign: 'center',
    paddingHorizontal: 8,
    lineHeight: 50,
  },
});

export default Fortune;
