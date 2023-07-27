import { StyleSheet } from "react-native";

const barbieStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "#FF69B4",
    },
    text: {
      fontFamily: 'barbie',
      fontSize: 50,
      color: 'white',
      alignSelf: 'center',
      textAlign: 'center',
      paddingHorizontal: 8,
      lineHeight: 70,
    },
    question: {
      fontFamily: 'press-start',
      fontSize: 90,
      alignSelf: 'center',
      textAlign: 'center',
    },
  });

export default barbieStyles;