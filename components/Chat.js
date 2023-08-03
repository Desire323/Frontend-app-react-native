import { StyleSheet, View, TextInput, ScrollView, Text } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import jwtDecode from 'jwt-decode';
import Icon from './Icon';
import * as encoding from 'text-encoding';
import { getMessages } from './api/chat_api';
import TimestampToDateTime from './dateTime/TimestampToDateTime';


function Chat() {
    const [client, setClient] = useState(null);
    const [token, setToken] = useState(null);
    const [senderId, setSenderId] = useState(null);
    const [receiverId, setReceiverId] = useState(null);
    const [message, setMessage] = useState();
    const [messages, setMessages] = useState([]);
    const [oldMessagesFetched, setOldMessagesFetched] = useState(false);
    const [currentCoversationId, setCurrentConversationId] = useState(null);
    const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);
    const [chatWithName, setChatWithName] = useState(null);

    const textInputRef = useRef();
    const scrollViewRef = useRef();

      useEffect(() => {
        const initializeChat = async () => {
            const token = await AsyncStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const tokenSenderId = decodedToken.id;
            console.log("Token sender Id: " + tokenSenderId)
            setSenderId(tokenSenderId);
            setToken(token);
            
            const url = 'http://10.16.6.20:8000/ws';
            const conversationId = await AsyncStorage.getItem('conversationId');
            const receiverId = await AsyncStorage.getItem('receiverId');
            const chatWithName = await AsyncStorage.getItem('chatWithName');
            
            setChatWithName(chatWithName);
            console.log("Conversation ID IN PRIVATE CHATS: " + conversationId);
            setCurrentConversationId(conversationId);
            setReceiverId(receiverId);
            console.log("Chat.js CURRENT Conversation ID IN PRIVATE CHATS: " + conversationId);
            
            try {
                const oldMessages = await getMessages(token, conversationId);
                console.log("OLD MESSAGES: " + oldMessages);
                setMessages(oldMessages.reverse());
                setOldMessagesFetched(true);
            } catch (error) {
                console.log("Error fetching old messages:", error);
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
        
        return () => {
            if (client) {
                client.disconnect(() => {
                    console.log('Disconnected');
                });
            }
        };
    }, []);
    
    
    useEffect(() => { setTimeout(() => { 
      setSelectedMessageIndex(null) }, 4000); 
    }, [selectedMessageIndex]);

    useEffect(() => {
      setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
  }, [messages]);
   
    const handleSubmit = (event) => {
        event.preventDefault();
        client.send("/app/private-chat", {}, JSON.stringify({'senderId': senderId, 'receiverId': receiverId, 'message': message}));
        setMessage("");
        textInputRef.current.clear();
    };


  return (
    <View  style={styles.container}>
      <Text style={styles.chatWith}>{chatWithName}</Text>
        <ScrollView ref={scrollViewRef} style={styles.messagesList}>
        {messages && messages.map((message, index) => (
    <View key={index}>
        <Text 
            onPress={() => setSelectedMessageIndex(index)}
            style={StyleSheet.compose(
                styles.message, 
                message.senderId === senderId ? { alignSelf:"flex-end"} : { alignSelf:"flex-start"} 
                )}
        >
            {message.message}
        </Text>
        {selectedMessageIndex === index && <TimestampToDateTime style={
          StyleSheet.compose(
                styles.date, 
                message.senderId === senderId ? { alignSelf:"flex-end"} : { alignSelf:"flex-start"} 
            )}
              timestamp={message.timestamp} />}
    </View>
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
    chatWith: {
      borderBottomWidth: 1,
      width: "100%",
      alignSelf: "center",
      textAlign: "center",
      marginTop: 25,
      fontFamily: 'press-start',
    },
    sendMessageContainer: {
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
        alignSelf: "center",
        borderColor: "black",
        transform: [{ rotate: '-25deg' }]
    },
});

export default Chat;