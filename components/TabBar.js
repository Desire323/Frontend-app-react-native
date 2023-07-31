import { StyleSheet, View, Text } from 'react-native';
import Settings from './Settings';
import Icon from './Icon';
import { useNavigation } from '@react-navigation/native';


function TabBar() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>  
            <Icon icon={"account"} color={"black"} onPress={() => navigation.navigate("Profile")}/>
            
            <Text>Fortunes</Text>
            <Icon icon={"crystal-ball"} color={"black"} onPress={() => navigation.navigate("Fortune")}/>
            <Text>Feed</Text>
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
        // backgroundColor: 'red',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        // backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
});

export default TabBar;