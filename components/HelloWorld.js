import {View, Text, StatusBar, StyleSheet, TouchableOpacity, Image, Dimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function HelloWorldScreen(windowWidth, windowHeight) {
    
    const navigation = useNavigation();
    const handleTextPress = () => {
      if (AsyncStorage.getItem('token') !== null) {
        navigation.navigate('Fortune');
      }
      else {
        navigation.navigate('Welcome');
      }
    };
  
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={handleTextPress}>
        <Text style={styles.text}>Hello World!</Text>
        <Image
            source={require('./../assets/gifs/tv.gif')}
            style={styles.gif}
            autoplay
            loop
          />
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    gifContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    gif: {
      width: windowWidth * 0.6, // Adjust the width as needed
      height: windowHeight * 0.4, // Adjust the height as needed
    },
    text: {
      fontFamily: 'press-start',
      fontSize: 35,
      textAlign: 'center', // Align text in the center
    },
  });
  
  export default HelloWorldScreen;