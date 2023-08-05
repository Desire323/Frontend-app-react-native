import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, ScrollView, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import TabBar from './TabBar';
import { getConversationId, getLastMessage } from './api/chat_api';
import { getFriends } from './api/persons_api';
import PersonCard from './PersonCard';

function ChatsList() {
  const navigation = useNavigation();
  const [people, setPeople] = useState([]);
  const [token, setToken] = useState(null);
  const [selfId, setSelfId] = useState(null);

  async function getPeople() {
    try {
      const token = await AsyncStorage.getItem('token');
      const selfId = await AsyncStorage.getItem('selfId');
      setToken(token);
      setSelfId(selfId);
      const response = await getFriends(selfId, token);
      if (response) {
        setPeople(response.filter((person) => person.id !== JSON.parse(selfId)));
      }

      const updatedPeople = await Promise.all(response.map(async (person) => {
        const conversationId = await getConversationId(token, person.id);

        const lastMessage = await getLastMessage(token, conversationId);
        return { ...person, lastMessage: lastMessage };
      }));

      setPeople(updatedPeople);
      console.log("\n\n\nUpdated people: " + JSON.stringify(people))

    } catch (error) {
      console.error('Error getting people:', error);
    }
  }

  async function getUserId() {
    try {
      const token = await AsyncStorage.getItem('token');
      setToken(token);
      const tokenUserId = await AsyncStorage.getItem('selfId');
      console.log('Token User Id: ' + tokenUserId);
      setSelfId(tokenUserId);
    } catch (error) {
      console.error('Error getting user ID:', error);
    }
  }

  useEffect(() => {
    getPeople();
    getUserId();
  }, []);

  const handlePress = async (personId, firstname, lastname) => {
    try {
      console.log('Self ID: ' + selfId);
      console.log('Receiver ID: ' + personId);
      const conversationId = await getConversationId(token, personId);
      console.log('Conversation ID:', conversationId);
      await AsyncStorage.setItem('conversationId', conversationId);
      await AsyncStorage.setItem('receiverId', JSON.stringify(personId));
      await AsyncStorage.setItem('chatWithName', `${firstname} ${lastname}`);
      if (conversationId) {
        navigation.navigate('Chat');
      }
    } catch (error) {
      console.error('Error getting conversation ID:', error);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>ChatsList</Text>
      <View style={styles.scrollViewContainer}>
      <ScrollView>
        {people.map((person) => (
          <PersonCard 
          key={person.id} 
          person={person} 
          handlePress={handlePress}
          selfId={selfId}
          token={token}
          showMessage={true}
        />
        ))}
      </ScrollView>
      </View>
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    marginTop: 75,
    fontFamily: 'press-start',
    fontSize: 30,
    lineHeight: 50,
    textAlign: 'center',
    marginVertical: 40,
    borderBottomColor: 'black',
    borderBottomWidth: 5,
  },
  nameContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 5,
    height: 125,
  },
  name: {
    fontFamily: 'press-start',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 55,
  },
  lastMessage: {
    fontFamily: 'press-start',
    fontSize: 10,
    lineHeight: 15,
    width: 200,
  },
  profile: {
    marginHorizontal: 10,
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "black",
  },
  scrollViewContainer: {
    height: '85%',
    width: '100%',
  },
});

export default ChatsList;

