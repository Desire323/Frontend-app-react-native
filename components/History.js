import { StyleSheet, View, Text, Modal, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {fortune_history} from "./api/fortune_api";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import StyleManager from "./animations/styles/StyleManager";
import { checkTokenExpiration } from "./auth/authUtils";
import Button from "./Button";
import Icon from "./Icon";
import TimestampToDate from "./dateTime/TimestampToDate";
import ChatsList from "./ChatsList";

function History() {
    
    const navigation = useNavigation();
    const [history, setHistory] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [theme, setTheme] = useState("default");
    const [styles, setStyles] = useState(StyleManager({theme: theme}));
    const [modalVisible, setModalVisible] = useState(false);


    useEffect(() => {
        handleTokenExpiration();
        fetchHistory();
    }, []);


    useEffect(() => {
        setStyles(StyleManager({ theme: theme }));
      }, [theme]);

    useEffect(() => {
        const resetStyles = () => {
            setTheme(history[currentIndex]?.theme);
        }

        resetStyles();
    }, [currentIndex]);

    const handleTokenExpiration = async () => {
        const isTokenValid = await checkTokenExpiration();
    
        if (!isTokenValid) {
            navigation.navigate('Welcome');
        }};

    const fetchHistory = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fortune_history(token); 
            setCurrentIndex(0);
            setHistory(response);
            setTheme(response[0].theme);
            setStyles(StyleManager({theme: response[0].theme}));
        } catch (error) {
            console.log('Failed to fetch history');
        }
    };

    const handlePrevious = () => {
        if (currentIndex < history.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
    };
    
    const handleNext = () => {
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
    };
    
    const handleShare = async () => {
        console.log("Share: " + JSON.stringify(history[currentIndex]))
        await AsyncStorage.setItem('shareFortune', JSON.stringify(history[currentIndex]));
        console.log("Share fortune -> " + await AsyncStorage.getItem('shareFortune'));
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
          <Icon style={historyStyles.shareButton} icon="share" size={40} color="white" onPress={handleShare}/>
          <Text style={StyleSheet.compose(styles.text, {paddingBottom:"20%"})}>{history[currentIndex]?.wish}</Text>
          <View style={historyStyles.dateAndButtonsContainer}>
            <TimestampToDate timestamp={history[currentIndex]?.date} style={StyleSheet.compose( styles.text, {fontSize:17, lineHeight:20, marginBottom:70})}/>
            <View style={historyStyles.buttonContainer}>
              {currentIndex !== history.length-1 && <Button style={historyStyles.button} title="Previous" onPress={handlePrevious}/>}
              {currentIndex !== 0 && <Button style={historyStyles.button} title="Next" onPress={handleNext} />}
            </View>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={historyStyles.centeredView}>
              <View style={historyStyles.modalView}>
                <ChatsList showTabBar={false} />
                    <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}
                    >
                    <View style={historyStyles.hideModal}>
                        <Text style={historyStyles.textStyle}>Hide Modal</Text>
                    </View>
                    </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      );
      
}

const historyStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    dateAndButtonsContainer: {
      position: 'absolute', 
      bottom: 10,
      left: 0,
      right: 0,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    buttonContainer: {
      position: 'absolute', 
      bottom: 10, 
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 15,
      flexWrap: 'wrap',
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
    shareButton: {
        position: 'absolute',
        top: 30,
        right: 30,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
        position: 'absolute', 
        bottom: 0,
        width: '100%',
        backgroundColor: "white",
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderTopLeftRadius: 20, // Rounded corners at the top
        borderTopRightRadius: 20, // Rounded corners at the top
        height: '85%', // Modal will take up 85% of the screen height
      },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      fontFamily: 'press-start',
      fontSize: 13,
      color: "black",
      textAlign: "center",
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    },
    hideModal: {
      borderRadius: 20,
      padding: 13,
      backgroundColor: "#adebad",
      borderWidth: 1,
      borderColor: "#84e184"
    },
  });
  
export default History;
