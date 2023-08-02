import { StyleSheet, View } from 'react-native';
import Icon from './Icon';
import { useNavigation } from '@react-navigation/native';


function TabBar() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>  
            <Icon icon={"account"} color={"black"} onPress={() => navigation.navigate("Profile")}/>

            <Icon icon={"chat"} color={"black"} onPress={() => navigation.navigate("Chats")}/>
            <Icon icon={"crystal-ball"} color={"black"} onPress={() => navigation.navigate("Fortune")}/>
            <Icon icon={"chat"} color={"black"} onPress={() => navigation.navigate("Chat")}/>
            <Icon icon={"cog"} color={"black"} onPress={() => navigation.navigate("Settings")}/>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 50,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
    },
});

export default TabBar;