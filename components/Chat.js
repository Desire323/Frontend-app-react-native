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
    const [senderId, setSenderId] = useState(null);
    const [receiverId, setReceiverId] = useState(null);
    const [message, setMessage] = useState();
    const [messages, setMessages] = useState([]);
    const [currentCoversationId, setCurrentConversationId] = useState(null);
    const textInputRef = useRef();

    async function getUserId() {
        const token = await AsyncStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const tokenSenderId = decodedToken.id;
        console.log("Token sender Id: " + tokenSenderId)
        setSenderId(tokenSenderId);
    }

    useEffect(() => {
        getUserId();
        const initializeChat = async () => {
            const url = 'http://10.16.6.20:8080/ws';
            const conversationId = await AsyncStorage.getItem('conversationId');
            const receiverId = await AsyncStorage.getItem('receiverId');
            console.log("Conversation ID IN PRIVATE CHATS: " + conversationId);
            setCurrentConversationId(conversationId);
            setReceiverId(receiverId);
            console.log("CURRENT Conversation ID IN PRIVATE CHATS: " + conversationId);
            const oldMessages = await getMessages(conversationId);
            
            oldMessages.forEach(oldMessage => {
                setMessages((prevMessages) => [...prevMessages, oldMessage]);
            });
            console.log("OLD MESSAGES: " + oldMessages);
            const stompClient = Stomp.over(() => new SockJS(url));
        
            stompClient.connect({}, (frame) => {
                console.log('Connected: ' + frame);
                stompClient.subscribe(`/topic/messages/${conversationId}`, (message) => {
                    const messageData = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, messageData]);
                });
            });
    
            setClient(stompClient);
        }
    
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
            {messages.map((message, index) => (
                <Text style={StyleSheet.compose(styles.message, message.senderId === senderId ? { alignSelf:"flex-end"} : { alignSelf:"flex-start"} )} key={index}>{message.message}</Text>
            ))}
        </ScrollView>
        <View>
            {/* <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={text => setReceiverId(text)}
                placeholder="Receiver's ID"
                keyboardType="numeric"
            /> */}
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






// import React, { useEffect, useState, useRef } from 'react';
// import { StyleSheet, Button, TextInput, View, ScrollView, Text } from 'react-native';
// import SockJS from 'sockjs-client';
// import { Stomp } from '@stomp/stompjs';

// const TextEncodingPolyfill = require('text-encoding');
// const BigInt = require('big-integer')

// Object.assign(global, {
//     TextEncoder: TextEncodingPolyfill.TextEncoder,
//     TextDecoder: TextEncodingPolyfill.TextDecoder,
//     BigInt: BigInt,
// });

// const Chat = () => {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState({ senderId: '', receiverId: '', content: '' });
//     const stompClient = useRef(null);

//     useEffect(() => {
//         const url = 'http://10.16.6.20:8080/ws';
//         const stompClient = Stomp.over(() => new SockJS(url));

//         stompClient.connect({}, frame => {
//             console.log('Connected: ' + frame);
//             stompClient.subscribe('/topic/messages', function (message) {
//                 setMessages(prev => [...prev, JSON.parse(message.body).content]);
//             });
//         });

//         return () => {
//             if (stompClient) {
//                 stompClient.disconnect();
//             }
//         };
//     }, []);

//     const sendMessage = (event) => {
//         event.preventDefault();
//         if (stompClient) {
//             console.log("Stomp client: ", stompClient);
//             stompClient.send("/app/chat", {}, JSON.stringify(input));
//             setInput({ senderId: '', receiverId: '', content: '' });
//         }
//     };


//   return (
//     <View style={styles.container}>
//       <ScrollView>{messages.map((msg, i) => (
//         <Text key={i}>{msg}</Text>
//       ))}
//       </ScrollView>
//       <TextInput
//         value={input.senderId}
//         onChangeText={(value) => setInput((prev) => ({ ...prev, senderId: value }))}
//         placeholder="Your ID"
//       />
//       <TextInput
//         value={input.receiverId}
//         onChangeText={(value) => setInput((prev) => ({ ...prev, receiverId: value }))}
//         placeholder="Receiver's ID"
//       />
//       <View style={styles.sendMessageContainer}>
//       <TextInput
//         value={input.content}
//         onChangeText={(value) => setInput((prev) => ({ ...prev, content: value }))}
//         placeholder="Message"
//       />
//       <Button title="Send" onPress={sendMessage} />
//     </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: "flex-end",
//         alignItems: "center",
//     },
//     sendMessageContainer: {
//         flex: 1,
//         flexDirection: "row",
//         borderWidth: 1,
//         width: "100%",
//         maxHeight: 50,
//     },  
// });

// export default Chat;
