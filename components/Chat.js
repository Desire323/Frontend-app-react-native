import { StyleSheet, View, TextInput, ScrollView, Text } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import jwtDecode from 'jwt-decode';
import Icon from './Icon';
import * as encoding from 'text-encoding';
import { getMessages } from './api/chat_api';


function Chat() {
    const [client, setClient] = useState(null);
    const [token, setToken] = useState(null);
    const [senderId, setSenderId] = useState(null);
    const [receiverId, setReceiverId] = useState(null);
    const [message, setMessage] = useState();
    const [messages, setMessages] = useState([]);
    const [oldMessagesFetched, setOldMessagesFetched] = useState(false);
    const [currentCoversationId, setCurrentConversationId] = useState(null);
    const textInputRef = useRef();

    async function getUserId() {
        const token = await AsyncStorage.getItem('token');
        setToken(token)
        const decodedToken = jwtDecode(token);
        const tokenSenderId = decodedToken.id;
        console.log("Token sender Id: " + tokenSenderId)
        setSenderId(tokenSenderId);
    }
 
    useEffect(() => {
        // Fetch old messages once when the component mounts
        if (!oldMessagesFetched && currentCoversationId && token) {
          const fetchOldMessages = async () => {
            try {
              const oldMessages = await getMessages(token, currentCoversationId);
              console.log("OLD MESSAGES: ", oldMessages);
              setMessages(oldMessages.reverse());
            } catch (error) {
              console.error("Error fetching old messages:", error);
            } finally {
              // Mark old messages as fetched
              setOldMessagesFetched(true);
            }
          };
    
          fetchOldMessages();
        }
      }, [oldMessagesFetched, currentCoversationId, token]);

    useEffect(() => {
        getUserId();
        const initializeChat = async () => {
            const url = 'http://10.16.6.20:8000/ws';
            const conversationId = await AsyncStorage.getItem('conversationId');
            const receiverId = await AsyncStorage.getItem('receiverId');
            console.log("Conversation ID IN PRIVATE CHATS: " + conversationId);
            setCurrentConversationId(conversationId);
            setReceiverId(receiverId);
            console.log("Chat.js CURRENT Conversation ID IN PRIVATE CHATS: " + conversationId);
            
            try {
              const oldMessages = await getMessages(token, conversationId);
              console.log("OLD MESSAGES: " + oldMessages);
              setMessages(oldMessages.reverse());
            } catch (error) {
              console.error("Error fetching old messages:", error);
            }
            const stompClient = Stomp.over(() => new SockJS(url));
            console.log(`Chat.js url=${url} and stompClient = ${stompClient}`)
          
            stompClient.connect({}, (frame) => {
              console.log('Connected: ' + frame);
              stompClient.subscribe(`/topic/messages/${conversationId}`, (message) => {
                const messageData = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, messageData]);
              });
            });
          
            setClient(stompClient);
          };
          
    
        initializeChat();
    
        // Cleanup function
        return () => {
            if (client) {
                client.disconnect(() => {
                    console.log('Disconnected');
                });
            }
        };
    }, []);
    
  
    const handleSubmit = (event) => {
        event.preventDefault();
        //receiverId in asyncStorage
        client.send("/app/private-chat", {}, JSON.stringify({'senderId': senderId, 'receiverId': receiverId, 'message': message}));
        setMessage("");
        textInputRef.current.clear();
    };


  return (
    <View  style={styles.container}>
        <ScrollView style={styles.messagesList}>
            {messages && messages.map((message, index) => (
                <Text style={StyleSheet.compose(styles.message, message.senderId === senderId ? { alignSelf:"flex-end"} : { alignSelf:"flex-start"} )} key={index}>{message.message}</Text>
            ))}
        </ScrollView>
        <View>
          <View style={styles.sendMessageContainer}>
            <TextInput
                ref={textInputRef}
                style={styles.messageInput}
                multiline={true}
                scrollEnabled={true}
                onChangeText={text => setMessage(text)}
                placeholder="Message"
            />
            <Icon style={styles.sendMessageButton} icon={"send"} color={"black"} size={35} onPress={handleSubmit}/>
            </View>
        </View>
    </View>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        margin: 16,
    },
    message: {
        borderRadius: 15,
        borderWidth: 1,
        maxWidth: "80%",
        flexWrap: "wrap",
        padding: 10,
        marginVertical: 10,
    },
    sendMessageContainer: {
        // flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        height: 50,
    },
    messageInput: {
      width: "80%",
      borderRadius: 10,
      paddingLeft:10,
      borderWidth: 1,
    },
    messagesList: {
        marginTop: 16,
    },
    sendMessageButton: {
        // width: "20%",
        alignSelf: "center",
        // borderWidth: 1,
        borderColor: "black",
        transform: [{ rotate: '-25deg' }]
    },
});

export default Chat;

// Connection closed to http://10.16.6.20:8000/ws