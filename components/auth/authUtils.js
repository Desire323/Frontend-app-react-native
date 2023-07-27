import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

const checkTokenExpiration = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();

      if (currentTime > expirationTime) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log('Error while checking token expiration:', error);
    return false;
  }
};

export { checkTokenExpiration };