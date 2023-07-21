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

    // Check password length
    if (password.length < 8) {
      Alert.alert('Password should be at least 8 characters');
      return;
    }

    // Check password for uppercase letter
    if (!/[A-Z]/.test(password)) {
      Alert.alert('Password should contain at least one uppercase letter');
      return;
    }

    // Check password for lowercase letter
    if (!/[a-z]/.test(password)) {
      Alert.alert('Password should contain at least one lowercase letter');
      return;
    }

    // Check password for number
    if (!/\d/.test(password)) {
      Alert.alert('Password should contain at least one number');
      return;
    }

    // Check password for special character
    if (!/[^A-Za-z0-9]/.test(password)) {
      Alert.alert('Password should contain at least one special character');
      return;
    }

    auth_login({
      email: email.toLocaleLowerCase(),
      password: password
    }).then((response) => {
      if (response.status === 200) {
        AsyncStorage.setItem('token', response.data);
        AsyncStorage.setItem('email', email);
        console.log(`\nresponse data: ${response.data}`);
        // console.log(`\nresponse headers: ${response.headers}`);
        console.log('Login successful');
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
