import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions  } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GifPlayer from 'react-native-gif';

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
        <GifPlayer
          source={require('./assets/gifs/tv.gif')}
          style={styles.gif}
          resizeMode="contain"
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
    navigation.navigate('HelloWorld');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleTextPress}>
        <Text style={styles.text}>Welcome to our app</Text>
      </TouchableOpacity>
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
            name="Welcome"
            component={WelcomeScreen}
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
    fontSize: 40,
    textAlign: 'center', // Align text in the center
  },
});
