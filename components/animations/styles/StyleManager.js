import React from 'react';
import { StyleSheet } from 'react-native';
import oppenheimerStyles from './OppenheimerStyle';
import barbieStyles from './BarbieStyle';


function StyleManager({theme}) {
  
    switch (theme) {
      case 'Barbie':
        return barbieStyles;
      case 'Oppenheimer':
        return oppenheimerStyles;
    default:
        return defaultStyles;
  };
}

const defaultStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontFamily: 'press-start',
      fontSize: 30,
      flexWrap: 'wrap',
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
  
export default StyleManager;
    