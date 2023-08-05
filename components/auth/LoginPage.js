import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth_login} from '../api/auth_api';
import styles from './authStyles';
import { extractIdFromToken } from './authUtils';
import CustomAlert from './../CustomAlert';

function LoginPage({ state, setState }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const handleLogin = () => {
    if (!validateEmail(email)) {
      setAlertMessage('Invalid email format');
      setShowAlert(true);
      return;
    }

    auth_login({
      email: email.toLocaleLowerCase(),
      password: password
    }).then((response) => {
      if (response.status === 200) {

        AsyncStorage.setItem('token', response.data.jwt);
        AsyncStorage.setItem('firstname', response.data.firstname);
        AsyncStorage.setItem('lastname', response.data.lastname);
        AsyncStorage.setItem('email', email);
        AsyncStorage.setItem('selfId', JSON.stringify(extractIdFromToken(response.data.jwt)));

        try{
        navigation.navigate('Fortune');
        } catch (error) {
          console.error("Can't navigate to Fortune");
        }
      }
      else {
        console.log(`\nresponse: ${response}`);
        setAlertMessage('Login failed');
        setShowAlert(true);
      }
    }).catch((error) => {
        console.error('Error:', error);
        setAlertMessage('Something went wrong');
        setShowAlert(true);
    });
  };

  return (
    <View style={styles.container}>
      <CustomAlert
        visible={showAlert}
        title="Alert"
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />
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
