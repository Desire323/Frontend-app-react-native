import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, ScrollView, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import TabBar from './TabBar';
import { getConversationId, getLastMessage } from './api/chat_api';
import { getFriends } from './api/persons_api';
import PersonCard from './PersonCard';

function ChatsList({showTabBar}) {
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
      console.log('Conversation ID:', await conversationId);
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
      {showTabBar !== false && <TabBar style={styles.tabBar}/>}
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
  scrollViewContainer: {
    height: '85%',
    width: '100%',
  },
  tabBar: {
    backgroundColor: '#ececec',
  },
});

export default ChatsList;

