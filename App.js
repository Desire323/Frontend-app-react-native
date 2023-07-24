import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HelloWorldScreen from './components/HelloWorld';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import MyCamera from './components/Camera';
import Gallery from './components/Gallery';
import Fortune  from './components/Fortune';
import Bomb from './components/Bomb';
import MovingImage from './components/MovingImage';
import Barbie from './components/Barbie';

function WelcomeScreen({ navigation }) {
  const [state, setState] = useState(true);
  const handleTextPress = () => {
    navigation.navigate('Barbie');
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

const Stack = createStackNavigator();

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  const loadFont = async () => {
    await Font.loadAsync({
      'press-start': require('./assets/fonts/PressStart2P-Regular.ttf'),
      'barbie': require('./assets/fonts/barbie.ttf'),
    });
    setFontLoaded(true);
  };

  useEffect(() => {
    loadFont();
  }, []);

  return (
    <NavigationContainer>
      {fontLoaded ? (
        <Stack.Navigator initialRouteName="HelloWorld">
        <Stack.Screen
          name="HelloWorld"
          component={HelloWorldScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Camera"
          component={MyCamera}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Barbie"
          component={Barbie}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Gallery"
          component={Gallery}
          // component={PhotoPicker}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Fortune"
          component={Fortune}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>      
      ) : null}
    </NavigationContainer>
  );
}

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
    textAlign: 'center', // Align text in the center
  },
});
