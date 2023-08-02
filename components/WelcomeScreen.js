import React, { useState } from 'react';
import {View, Text, StatusBar, StyleSheet, TouchableOpacity} from 'react-native';
import RegisterPage from './auth/RegisterPage';
import LoginPage from './auth/LoginPage';

function WelcomeScreen({ navigation }) {
  const [state, setState] = useState(true);
  const handleTextPress = () => {
    navigation.navigate('Fortune');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleTextPress}>
        <Text style={styles.text}>Welcome</Text>
        <Text style={styles.text}>to our</Text>
        <Text style={styles.text}>app</Text>
      </TouchableOpacity>

      { state ? <LoginPage state={state} setState={setState}/>
       : <RegisterPage state={state} setState={setState}/>
      }
      <StatusBar style="auto" />
    </View>
  );
}

export default WelcomeScreen;

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
  
    text: {
      fontFamily: 'press-start',
      fontSize: 35,
      textAlign: 'center',
    },
  });