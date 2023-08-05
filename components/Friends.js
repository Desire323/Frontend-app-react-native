import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import TabBar from './TabBar';
import { getAllPersons, getFriends, makeFriends } from './api/persons_api';
import CustomAlert from './CustomAlert';
import PersonCard from './PersonCard';

function Friends() {
  const navigation = useNavigation();
  const [people, setPeople] = useState([]);
  const [token, setToken] = useState(null);
  const [selfId, setSelfId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');

  async function getPeople() {
    try {
      const token = await AsyncStorage.getItem('token');
      const selfId = await AsyncStorage.getItem('selfId');
      setToken(token);
      const response = await getAllPersons(token);
      setPeople(response.filter((person) => person.id !== JSON.parse(selfId)));
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

  const handlePress = async (personId) => {
    try {
      console.log('Self ID: ' + selfId);
      console.log('Receiver ID: ' + personId);
      const response = await makeFriends(selfId, personId, token);
      if(response){
        setAlertTitle(response);
        setShowAlert(true);
        return console.log(response);
      }
    } catch (error) {
      console.error('Error making friends:', error);
    }
  };
  

  return (
    <View style={styles.container}>
       <CustomAlert
      visible={showAlert}
      title={alertTitle ? alertTitle : "Response"}
      message={alertMessage ? alertMessage : ""}
      onClose={() => setShowAlert(false)}
    />

      <Text style={styles.heading}>Friends</Text>
      <View style={styles.scrollViewContainer}>
      <ScrollView
          style={{maxHeight: '85%'}}>
        {people.map((person) => (
          <PersonCard
            person={person}
            handlePress={handlePress}
          />
        ))}
      </ScrollView>
      </View>
      <TabBar/>
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
});

export default Friends;
