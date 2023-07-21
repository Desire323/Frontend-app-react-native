import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, FlatList, Dimensions, BackHandler, TouchableWithoutFeedback, TouchableOpacity, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

function PhotoPicker() {
  const [image, setImage] = useState(null);
  const [photos, setPhotos] = useState([]);
  
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (image) {
          return true
        } else {
            setImage(null);
            console.log(image)
            return true;
        }
      });
    
      (async () => {
        await MediaLibrary.requestPermissionsAsync();
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(status === 'granted');
      })();


    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync().catch(error => console.error(error));
      if (status !== 'granted') {
        alert('Permission denied');
      } else {
        let updatedPhotos = [];
        if (Platform.OS === 'android') {
          const album = await MediaLibrary.getAlbumAsync("Camera");
          if(album) {
            updatedPhotos = await getAllPhotos(album.id, 100);
          }
        } else if (Platform.OS === 'ios') {
          updatedPhotos = await getAllPhotos();
        }
        setPhotos(updatedPhotos);
      }
    })();
    return () => {
        backHandler.remove();
      };
  }, []);

  const getAllPhotos = async (id) => {
    let album;
    if (id) {
      album = await MediaLibrary.getAssetsAsync({album: id, mediaType: 'photo', first: 102, sortBy: ['creationTime']});
    } else {
      album = await MediaLibrary.getAssetsAsync({mediaType: 'photo', first: 102, sortBy: ['creationTime']});
    }

    const foundPhotos = album['assets'];
    const updatedPhotos = [];
    for (let i = 0; i < foundPhotos.length; i++){
        const updatedPhoto = await MediaLibrary.getAssetInfoAsync(foundPhotos[i].id);
        updatedPhotos.push({
            uri: updatedPhoto['localUri'],
            id: updatedPhoto['id']
        });
    }
    return updatedPhotos;  // Reverse to get the latest photos first
  }
  const handleOutsidePress = () => {
        setImage(null);
  }
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setImage(item.uri)}>
      <Image
        style={styles.image}
        source={{ uri: item.uri }}
      />
    </TouchableOpacity>
  );

  return (
    <View style={image ? styles.imageContainer : styles.container}>
      {image 
        ? 
        (<TouchableWithoutFeedback onPress={handleOutsidePress}>
        <Image source={{ uri: image }} style={{ width: 400, height: 400}}/>
        </TouchableWithoutFeedback>)
        :
    <FlatList
          data={photos}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height:300,
    flexDirection: 'column',
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  image: {
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').width / 3,
  },
  outsideImage: {
    flex:1,
    backgroundColor: 'transparent',

    // backgroundColor: "transparent",
    // zIndex:1,
  }

});

export default PhotoPicker;
