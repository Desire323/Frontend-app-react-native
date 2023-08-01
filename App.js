import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HelloWorldScreen from './components/HelloWorld';
import MyCamera from './components/Camera';
import Gallery from './components/Gallery';
import Fortune  from './components/Fortune';
import Barbie from './components/animations/Barbie';
import History from './components/History';
import WelcomeScreen from './components/WelcomeScreen';
import Profile from './components/Profile';
import Settings from './components/Settings';
import ChatsList from './components/ChatsList';
import Chat from './components/Chat';

const Stack = createStackNavigator();

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  const loadFont = async () => {
    await Font.loadAsync({
      'press-start': require('./assets/fonts/PressStart2P-Regular.ttf'),
      'barbie': require('./assets/fonts/barbie.ttf'),
      'oppenheimer' : require('./assets/fonts/BungeeSpice-Regular.ttf'),
      // 'oppenheimer' : require('./assets/fonts/GothamNarrowBold.otf'),
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
        <Stack.Screen
          name="History"
          component={History}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chats"
          component={ChatsList}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>      
      ) : null}
    </NavigationContainer>
  );
}

