import { StyleSheet } from "react-native";

const oppenheimerStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "black",
    },
    text: {
      fontFamily: 'oppenheimer',
      fontSize: 35,
      color: "#FF7F50",
      alignSelf: 'center',
      textAlign: 'center',
      paddingHorizontal: 8,
      lineHeight: 50,
    },
    question: {
      fontFamily: 'press-start',
      fontSize: 90,
      alignSelf: 'center',
      textAlign: 'center',
      paddingHorizontal: 8,
    },
  });

export default oppenheimerStyles;