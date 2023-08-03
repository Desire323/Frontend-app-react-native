import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import jwtDecode from 'jwt-decode';
import TabBar from './TabBar';
import { getAllPersons } from './api/persons_api';
import { getConversationId } from './api/chat_api';

function Friends() {
    const navigation = useNavigation();
    const [people, setPeople] = useState([]);
    const [token, setToken] = useState(null);
    const [selfId, setSelfId] = useState(null);
    
    async function getPeople() {
        const token = await AsyncStorage.getItem('token');
        setToken(token);
        const response = await getAllPersons(token);
        setPeople(response);
    }

    async function getUserId() {
        const token = await AsyncStorage.getItem('token');
        setToken(token);
        const decodedToken = jwtDecode(token);
        const tokenUserId = decodedToken.id;
        console.log("Token User Id: " + tokenUserId)
        setSelfId(tokenUserId);
    }

    useEffect(() => {
        getPeople();
        getUserId();
    }, []);

    const handlePress = async (personId, firstname, lastname) => {
        try {
            console.log("Self ID: " + selfId);
            console.log("Receiver ID: " + personId);
            const conversationId = await getConversationId(token, selfId, personId);
            console.log('Conversation ID:', conversationId);
            await AsyncStorage.setItem('conversationId', conversationId);
            await AsyncStorage.setItem('receiverId', JSON.stringify(personId));
            await AsyncStorage.setItem('chatWithName', (`${firstname} ${lastname}`));
            if(conversationId){
            navigation.navigate('Chat');
            }
        } catch (error) {
            console.error('Error getting conversation ID:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Friends</Text>
            {people && <ScrollView>
                {people.map((person) => (
                <TouchableOpacity style={styles.nameContainer} key={person.id} onPress={() => handlePress(person.id, person.firstname, person.lastname)}>
                    <Text style={styles.text} key={person.id}>{person.firstname} {person.lastname}</Text>
                </TouchableOpacity>
            ))}
            </ScrollView>}
            <TabBar/>
        </View>
    )
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
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        margin: 5,
    },
    text: {
        fontFamily: 'press-start',
        fontSize: 20,
        textAlign: 'center',
        lineHeight: 55,
    },
});

export default Friends;