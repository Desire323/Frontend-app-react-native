import { StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {fortune_history} from "./api/fortune_api";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import StyleManager from "./animations/styles/StyleManager";
import { checkTokenExpiration } from "./auth/authUtils";
import Button from "./Button";
import TimestampToDate from "./TimestampToDate";

function History() {
    
    const navigation = useNavigation();
    const [history, setHistory] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [theme, setTheme] = useState("default");
    const [styles, setStyles] = useState(StyleManager({theme: theme}));


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
    
    return (
        <View style={styles.container}>
            <Text style={StyleSheet.compose(styles.text, {paddingBottom:"20%"})}>{history[currentIndex]?.wish}</Text>
            <View style={historyStyles.dateAndButtonsContainer}>
                <TimestampToDate timestamp={history[currentIndex]?.date} style={StyleSheet.compose( styles.text, {fontSize:17, lineHeight:20, marginBottom:70})}/>
            <View style={historyStyles.buttonContainer}>
                {currentIndex !== history.length-1 && <Button style={historyStyles.button} title="Previous" onPress={handlePrevious}/>}
                {currentIndex !== 0 && <Button style={historyStyles.button} title="Next" onPress={handleNext} />}
            </View>
            </View>
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
    button: {
        marginHorizontal: 100,
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
  });

export default History;
