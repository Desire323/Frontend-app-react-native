import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import TabBar from './TabBar';
import { getFriendsCount } from './api/persons_api';
import { useNavigation } from '@react-navigation/native';

function Profile() {
    const navigation = useNavigation()
    const [firstname, setFirstname] = useState()
    const [lastname, setLastname] = useState()
    const [friendsCount, setFriendsCount] = useState() 
    
    useEffect(() => {
        const getProfileInfo = async () => {
            const token = await AsyncStorage.getItem('token');
            const selfId = await AsyncStorage.getItem('selfId');
            console.log("Self ID: " + selfId);
            setFirstname(await AsyncStorage.getItem('firstname'));
            setLastname(await AsyncStorage.getItem('lastname'));
            const friendsCount = await getFriendsCount(selfId, token)
            console.log("Friends count: " + friendsCount.data);
            
            setFriendsCount(friendsCount ? friendsCount : 0);
        };
        getProfileInfo();
    }, []);

    return (
        <View style={styles.container}>
            <Image
              source={require('./../assets/images/profile-default.png')}
                style={styles.profile}
            />
            <Text style={styles.name}> {firstname} {lastname}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Chats")}>
                <View style={styles.friendsCountContainer}>
               {friendsCount !== null && <Text style={styles.text}>{friendsCount}</Text>}
                <Text style={styles.text}>Friends</Text>
                </View>
            </TouchableOpacity>
            <TabBar/>
        </View>
    )
}

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    profile: {
        marginTop: 70,
        marginBottom: 25,
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
    friendsCountContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text:{
        fontSize: 16,
        fontFamily: 'press-start',
        textAlign: 'center',
        margin: 5,
    },
});
