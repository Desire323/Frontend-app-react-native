import { StyleSheet, View, Text } from 'react-native';
import TabBar from './TabBar';

function Friends() {

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Friends</Text>
            <TabBar/>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: 'press-start',
        fontSize: 35,
        textAlign: 'center',
        lineHeight: 50,
    },
});

export default Friends;