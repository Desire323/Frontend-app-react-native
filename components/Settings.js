import {StyleSheet, Text, View, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from './Button';
import { useNavigation } from '@react-navigation/native';
import {registerForPushNotificationsAsync} from './notifications/NotificationsUtils';


function Settings() {
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.setItem('firstname', 'World');
            await AsyncStorage.removeItem('lastname');
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('lastReceivedDate');
            await AsyncStorage.removeItem('lastFortune');
            await AsyncStorage.removeItem('conversationId');
            await AsyncStorage.removeItem('receiverId');
            await AsyncStorage.removeItem('chatWithName');
            
            navigation.navigate('Welcome');
        } catch (error) {
            console.log('Error occured while logging out');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Settings</Text>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Button style={styles.button} title="test" onPress={async () => {
                    const token = await registerForPushNotificationsAsync(); 
                    console.log("ExpoToken: " + token);
                    console.log(JSON.stringify( token ))
                }}/>
                <Button style={styles.button} title="Notifications" onPress={() => navigation.navigate('NotificationScreen')}/>
                <Button style={styles.logout} textStyle={styles.text} title="Logout" onPress={handleLogout}/>
            </ScrollView>
        </View>
    )
}

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    scrollView: {
        alignItems: 'center',
    },
    heading: {
        fontFamily: 'press-start',
        fontSize: 30,
        lineHeight: 50,
        textAlign: 'center',
        marginVertical: 40,
        borderBottomColor: 'black',
        borderBottomWidth: 5,
    },
    logout: {
        backgroundColor: '#D2042D',
        borderColor: '#D22B2B',
        borderWidth: 2,
        width: 170,
    },
    button: {
        width: 300,
        marginVertical: 10,
        borderRadius: 15,
     },
    text: {
        fontFamily: 'press-start',
        color: '#FFC0CB',
    },
});