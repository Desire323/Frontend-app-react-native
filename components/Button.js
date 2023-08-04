import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

function Button(props) {
  const { onPress, title = 'Save', style, textStyle } = props;
  return (
    <Pressable style={StyleSheet.compose(styles.button, style)} onPress={onPress}>
      <Text style={StyleSheet.compose(styles.text, textStyle)}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginHorizontal: 20,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default Button;