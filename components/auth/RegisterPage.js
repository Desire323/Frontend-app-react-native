import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth_register } from '../api/auth_api';
import styles from './authStyles';
import CustomAlert from './../CustomAlert';

function RegisterPage({ state, setState}) {
  const navigation = useNavigation();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const handleRegister = () => {
    if (firstname.trim() === '') {
      setAlertMessage('First name cannot be empty');
      setShowAlert(true);
      return;
    }
  
    if (lastname.trim() === '') {
      setAlertMessage('Last name cannot be empty');
      setShowAlert(true);
      return;
    }
    
    if (!validateEmail(email)) {
      setAlertMessage('Invalid email format');
      setShowAlert(true);
      return;
    }

    if (password.length < 8) {
      setAlertMessage('Password should be at least 8 characters');
      setShowAlert(true);
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setAlertMessage('Password should contain at least one uppercase letter');
      setShowAlert(true);
      return;
    }

    if (!/[a-z]/.test(password)) {
      setAlertMessage('Password should contain at least one lowercase letter');
      setShowAlert(true);
      return;
    }

    if (!/\d/.test(password)) {
      setAlertMessage('Password should contain at least one number');
      setShowAlert(true);
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setAlertMessage('Password should contain at least one special character');
      setShowAlert(true);
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
        setAlertMessage('Registration failed');
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
