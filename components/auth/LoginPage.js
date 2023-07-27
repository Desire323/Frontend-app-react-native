import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth_login} from '../api/auth_api';
import styles from './authStyles';

function LoginPage({ state, setState }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const handleLogin = () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid email format');
      return;
    }


    auth_login({
      email: email.toLocaleLowerCase(),
      password: password
    }).then((response) => {
      if (response.status === 200) {
        AsyncStorage.setItem('token', response.data);
        AsyncStorage.setItem('email', email);
        try{
        navigation.navigate('Fortune');
        } catch (error) {
          console.error("Can't navigate to Fortune");
        }
      }
      else {
        console.log(`\nresponse: ${response}`);
        Alert.alert('Login failed');
      }
    }).catch((error) => {
        console.error('Error:', error);
        Alert.alert('Something went wrong');
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.credentialsContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button style={styles.button} title="Login" onPress={handleLogin} />
      </View>
      <TouchableOpacity onPress={() => setState(!state)}>
        <Text style={styles.text}>Don't have an account? Register here!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginPage;
