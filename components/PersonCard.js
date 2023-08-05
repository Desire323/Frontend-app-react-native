import React from 'react';
import { TouchableOpacity, Text, View, Image, StyleSheet } from 'react-native';

const PersonCard = ({ person, handlePress, selfId, token, showMessage}) => {
  return (
    <TouchableOpacity
      style={StyleSheet.compose(styles.nameContainer, showMessage ? {height: 125} : {height: 75})}
      key={person.id}
      onPress={() => handlePress(person.id, person.firstname, person.lastname)}
    >
      <Image
        source={require('./../assets/images/profile-default.png')}
        style={styles.profile}
      />
      <View>
        <Text style={styles.name}>{person.firstname} {person.lastname}</Text>
        {person.lastMessage ? <Text style={styles.lastMessage}>
          {person.id === person.lastMessage.senderId ? "Them: " : "You: "}
          {person.lastMessage.message.length > 30
            ? `${person.lastMessage.message.substring(0, 30)}...`
            : person.lastMessage.message}
        </Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  nameContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 5,
    height: 125,
  },
  name: {
    fontFamily: 'press-start',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 55,
  },
  lastMessage: {
    fontFamily: 'press-start',
    fontSize: 10,
    lineHeight: 15,
    width: 200,
  },
  profile: {
    marginHorizontal: 10,
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "black",
  },
});

export default PersonCard;
