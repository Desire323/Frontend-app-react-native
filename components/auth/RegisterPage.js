import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth_register } from '../api/auth_api';
import styles from './authStyles';

function RegisterPage({ state, setState}) {
  const navigation = useNavigation();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const handleRegister = () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid email format');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Password should be at least 8 characters');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      Alert.alert('Password should contain at least one uppercase letter');
      return;
    }

    if (!/[a-z]/.test(password)) {
      Alert.alert('Password should contain at least one lowercase letter');
      return;
    }

    if (!/\d/.test(password)) {
      Alert.alert('Password should contain at least one number');
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      Alert.alert('Password should contain at least one special character');
      return;
    }

    auth_register({
      firstname: firstname,
      lastname: lastname,
      email: email.toLocaleLowerCase(),
      password: password
    }).then((response) => {
      if (response.status === 200) {
        AsyncStorage.setItem('token', response.data);
        console.log('Registration successful');
        setState(!state);
      }
      else {
        console.log(`\nresponse: ${JSON.stringify(response.status)}`);
        Alert.alert('Registration failed');
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
          placeholder="Firstname"
          value={firstname}
          onChangeText={setFirstname}
        />
        <TextInput
          style={styles.input}
          placeholder="Lastname"
          value={lastname}
          onChangeText={setLastname}
        />
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
        <Button style={styles.button} title="Register" onPress={handleRegister} />
      </View>
      <TouchableOpacity onPress={() => setState(!state)}>
        <Text style={styles.text}>Already have an account? Login here!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterPage;
