import {StyleSheet, View, Image, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

function Profile() {

    const [firstname, setFirstname] = useState()
    const [lastname, setLastname] = useState()
    
    useEffect(() => {
        const getName = async () => {
            setFirstname(await AsyncStorage.getItem('firstname'));
            setLastname(await AsyncStorage.getItem('lastname'));
        };
        getName();
    }, []);

    return (
        <View style={styles.container}>
        <Image
          source={require('./../assets/images/profile-default.png')}
            style={styles.profile}
        />
        <Text style={styles.name}> {firstname} {lastname}</Text>
        </View>
    )
}

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
    },
    profile: {
        margin: 50,
        width: 200,
        height: 200,
        borderRadius: 200 / 2,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "black",
    },
    name:{
        fontSize: 20,
        fontFamily: 'press-start',
        textAlign: 'center',
        margin: 20,
    },
});