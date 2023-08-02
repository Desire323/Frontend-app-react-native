import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import jwtDecode from 'jwt-decode';
import { getConversationId } from './api/chat_api';

function ChatsList() {
  const navigation = useNavigation();
  const [token, setToken] = useState(null);
  const hardcodedIdsArray = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const [selfId, setSelfId] = useState(null);

  useEffect(() => {
    async function getUserId() {
        const token = await AsyncStorage.getItem('token');
        setToken(token);
        const decodedToken = jwtDecode(token);
        const tokenUserId = decodedToken.id;
        console.log("Token User Id: " + tokenUserId)
        setSelfId(tokenUserId);
    }
    getUserId();
  }, []);

  const handlePress = async (receiverId) => {
    try {
        console.log("Self ID: " + selfId);
        console.log("Receiver ID: " + receiverId);
      const conversationId = await getConversationId(token, selfId, receiverId);
      console.log('Conversation ID:', conversationId);
      await AsyncStorage.setItem('conversationId', conversationId);
      await AsyncStorage.setItem('receiverId', JSON.stringify(receiverId));
      if(conversationId){
        navigation.navigate('Chat');
      }
    } catch (error) {
      console.error('Error getting conversation ID:', error);
    }
  };

  if (selfId === null) {
    return <View><Text>Loading...</Text></View>; // Render a loading state if selfId is not loaded
  }

  return (
    <View style={styles.container}>
        {hardcodedIdsArray.map((id) => (
          <TouchableOpacity key={id} onPress={() => handlePress(id)}>
            <Text style={styles.text}>{id}</Text>
          </TouchableOpacity>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
  },
  text: {
    width: 100,
    textAlign: 'center',
    fontSize: 20,
    margin: 10,
    borderWidth: 1,
  },
});

export default ChatsList;
