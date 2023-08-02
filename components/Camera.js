import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, Platform, BackHandler, Button, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import { BottomSheet } from 'react-native-btr';
import Gallery from './Gallery'

import Icon from './Icon';

function MyCamera() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);

  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState('4:3');
  const { height, width } = Dimensions.get('window');
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] = useState(false);
  const [type, setType] = useState(CameraType.back);
  const [photo, setPhoto] = useState(null);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [flashIconColor, setFlashIconColor] = useState("white")
  const [visible, setVisible] = useState(false)

  const cameraRef = useRef(camera);

  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  }  

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (photo) {
        retakePicture();
        return true;
      } else {
        return false;
      }
    });
    
    (async () => {
      await MediaLibrary.requestPermissionsAsync();
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  
    return () => {
      backHandler.remove();
    };
  }, [photo]);
  

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }


  const prepareRatio = async () => {
    let desiredRatio = '4:3';

    if (Platform.OS === 'android') {
      const ratios = await camera.getSupportedRatiosAsync();

      let distances = {};
      let realRatios = {};
      let minDistance = null;
      for (const ratio of ratios) {
        const parts = ratio.split(':');
        const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
        realRatios[ratio] = realRatio;

        const distance = screenRatio - realRatio;
        distances[ratio] = realRatio;
        if (minDistance == null) {
          minDistance = ratio;
        } else {
          if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio;
          }
        }
      }

      desiredRatio = minDistance;

      const remainder = Math.floor((height - realRatios[desiredRatio] * width) / 2);

      setImagePadding(remainder);
      setRatio(desiredRatio);

      setIsRatioSet(true);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setPhoto(data.uri);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const savePicture = async () => {
    if(photo) {
      try {
        await MediaLibrary.createAssetAsync(photo);
        alert("Picture saved!")
        setPhoto(null);

      }catch(e) {
        console.log(e)
      }
    }
  }

  const retakePicture = async () => {
    if(photo) {
      setPhoto(null);
    }
  }

  const toggleBottomNavigationView = () => {
    setVisible(!visible);
  };
  const setCameraReady = async () => {
    if (!isRatioSet) {
      await prepareRatio();
    }
  };

  if (hasCameraPermission === null) {
    return (
      <View style={styles.information}>
        <Text>Waiting for camera permissions</Text>
      </View>
    );
  } else if (hasCameraPermission === false) {
    return (
      <View style={styles.information}>
        <Text>No access to camera</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {!photo ? (
          <Camera
            style={[styles.cameraPreview, { marginTop: imagePadding, marginBottom: imagePadding }]}
            onCameraReady={setCameraReady}
            ratio={ratio}
            type={type}
            flashMode={flash}
            ref={(ref) => {
              setCamera((prevCamera) => {
                cameraRef.current = ref;
                return ref;
              });
            }}
          >
            <View style={styles.upperButtons}>
              
              <Icon icon={"cross"} onPress={goBack} size={40}></Icon>
              <Icon icon={"flash"} color={flashIconColor} onPress={() => {
                  flash === Camera.Constants.FlashMode.off
                  ? (setFlash(Camera.Constants.FlashMode.on), setFlashIconColor("yellow"), console.log(flash))
                  : (setFlash(Camera.Constants.FlashMode.off), setFlashIconColor("white"), console.log(flash))
              }} size={40}></Icon>
            </View>
            <View style={styles.buttonContainer}>
            <BottomSheet style={styles.bottomSheet}
          visible={visible}
          onBackButtonPress={toggleBottomNavigationView}
          onBackdropPress={toggleBottomNavigationView}
          
        ><Gallery/></BottomSheet>
              <Icon icon={"controller-stop"} onPress={toggleBottomNavigationView}size={60}></Icon>
              <Icon icon={"circle"} onPress={takePicture} size={80}></Icon>
              <Icon icon={"retweet"} onPress={toggleCameraType} size={40}></Icon>
            </View>
          </Camera>
        ) : (
          <Image source={{ uri: photo }} style={styles.camera} />
        )}
        <View>
          {photo &&
            <View>
              <Button title="Re-take" onPress={retakePicture}></Button>
              <Button title="Save" onPress={savePicture}></Button>
            </View>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  information: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  cameraPreview: {
    flex: 1,
    justifyContent: 'space-between',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems:'center',
    justifyContent: "space-between",
    margin: 10
  },
  button: {
    alignItems: 'center',
    margin: 10,
  },
  upperButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginTop: 10
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  bottomSheet: {
    height:100,
    color: 'white',
  },
});

export default MyCamera;