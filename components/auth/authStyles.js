import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
      height: '60%',
      justifyContent: 'space-between',
  },
    credentialsContainer: {
      marginTop: 50,
      padding: 100,
  
    },
    input: {
      width: 200,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 12,
      paddingHorizontal: 8,
      textAlign: 'center',
    },
    button: {
      width: 200,
      height: 40,
      justifyContent: 'center',
      marginTop: 12,
      backgroundColor:'#1E6738'
    },
    text: {
      alignSelf: 'center',
    }
  });

  export default styles;