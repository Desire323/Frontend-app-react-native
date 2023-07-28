import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from './Button';
import { useNavigation } from '@react-navigation/native';


function Settings() {
    const navigation = useNavigation();

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('firstname');
        await AsyncStorage.removeItem('lastname');
        await AsyncStorage.removeItem('email');
        navigation.navigate('Welcome');
    };

    return (
        <View>
            <Button title="Logout" onPress={handleLogout}/>
        </View>
    )
}

export default Settings;