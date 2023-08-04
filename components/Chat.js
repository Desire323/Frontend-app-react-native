import { Platform, TouchableOpacity, StyleSheet, View, TextInput, ScrollView, Text } from 'react-native';
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
            
            const url = `${process.env.API_GATEWAY_URL}/ws`;
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
        <View style={Platform.OS === 'ios' ? styles.containerIos : styles.container}>
          <View style={styles.chatWith}>
            <Text style={styles.chatWithName}>{chatWithName}</Text>
         </View>
          <ScrollView ref={scrollViewRef} style={styles.messagesList}>
            {messages &&
              messages.map((message, index) => (
                <View key={index}>
                  {selectedMessageIndex === index && <TimestampToDateTime style={
                    StyleSheet.compose(
                        styles.timestamp, 
                        message.senderId === senderId ? 
                            { alignSelf:"flex-end", paddingRight: 20} : 
                            { alignSelf:"flex-start", marginLeft: 20} 
                    )}
                    timestamp={message.timestamp} />}
                  <TouchableOpacity onPress={() => setSelectedMessageIndex(index)}
                    style={StyleSheet.compose(
                      styles.messageContainer,
                      message.senderId === senderId
                        ? styles.sentMessageContainer
                        : styles.receivedMessageContainer
                    )}
                  >
                    <Text style={styles.messageText}>{message.message}</Text>
                  </TouchableOpacity>
                  
                  {/* {selectedMessageIndex === index && (
                    <TimestampToDateTime
                      style={styles.timestamp}
                      timestamp={message.timestamp}
                    />
                  )} */}
                </View>
              ))}
          </ScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              ref={textInputRef}
              style={styles.messageInput}
              multiline={true}
              scrollEnabled={true}
              onChangeText={(text) => setMessage(text)}
              placeholder="Message"
            />
            <Icon
              style={styles.sendMessageButton}
              icon={"send"}
              color={"black"}
              size={35}
              onPress={handleSubmit}
            />
          </View>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        margin: 16,
        justifyContent: "flex-end",
      },
      containerIos: {
        flex: 1,
        margin: 16,
        marginTop: 35,
        justifyContent: "flex-end",
      },
      header: {
        backgroundColor: "#007AFF", // Blue color for the header background
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
      },
      chatWith: {
        borderBottomWidth: 1,
        width: "100%",
        alignSelf: "center",
        textAlign: "center",
        marginTop: 25,
        fontFamily: 'press-start',
        paddingBottom: 10,
      },
      chatWithName: {
        fontFamily: 'press-start',
        textAlign: "center",
        fontSize: 18,
        lineHeight: 30,
      },
      messagesList: {
        marginTop: 16,
      },
      messageContainer: {
        borderRadius: 15,
        maxWidth: "80%",
        flexWrap: "wrap",
        wordBreak: "break-word",
        padding: 10,
        marginVertical: 10,
      },
      sentMessageContainer: {
        alignSelf: "flex-end",
        backgroundColor: "#E0E0E0", // Light green for sent messages
      },
      receivedMessageContainer: {
        alignSelf: "flex-start",
        borderColor: "#E0E0E0",
        borderWidth: 1.5,
      },

      messageText: {
        borderRadius: 15,
        maxWidth: "80%",
        flexWrap: "wrap",
      },
      timestamp: {
        fontSize: 12,
        alignSelf: "center",
      },
      inputContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        height: 50,
        alignItems: "center",
      },
      messageInput: {
        flex: 1,
        // width: "80%",
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        fontSize: 16,
      },
      sendMessageButton: {
        marginLeft: 10,
        marginBottom: 10,
        alignSelf: "center",
        borderColor: "black",
        transform: [{ rotate: "-25deg" }],
      },
    });
    
    export default Chat;