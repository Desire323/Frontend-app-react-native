import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './components/LoginPage';
import MyCamera from './components/Camera';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function HelloWorldScreen({ navigation }) {
  const handleTextPress = () => {
    navigation.navigate('Welcome');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleTextPress}>
      <Text style={styles.text}>Hello World!</Text>
      <Image
          source={require('./assets/gifs/tv.gif')}
          style={styles.gif}
          autoplay
          loop
        />
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

function WelcomeScreen({ navigation }) {
  const handleTextPress = () => {
    navigation.navigate('Camera');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleTextPress}>
        <Text style={styles.text}>Welcome</Text>
        <Text style={styles.text}>to our</Text>
        <Text style={styles.text}>app</Text>
      </TouchableOpacity>
      <LoginPage></LoginPage>
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
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginPage}
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
  gif: {
    width: windowWidth * 0.6, // Adjust the width as needed
    height: windowHeight * 0.4, // Adjust the height as needed
  },
  text: {
    fontFamily: 'press-start',
    fontSize: 35,
    textAlign: 'center', // Align text in the center
  },
});
