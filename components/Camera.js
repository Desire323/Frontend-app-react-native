import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, Platform, BackHandler, Button, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import Icon from './Icon';

function MyCamera() {
  //  camera permissions
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);

  // Screen Ratio and image padding
  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState('4:3'); // default is 4:3
  const { height, width } = Dimensions.get('window');
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] = useState(false);
  const [type, setType] = useState(CameraType.back);
  const [photo, setPhoto] = useState(null);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [flashIconColor, setFlashIconColor] = useState("white")

  const cameraRef = useRef(camera);

  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  }  
  // on screen  load, ask for permission to use the camera
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

  // set the camera ratio and padding.
  // this code assumes a portrait mode screen
  const prepareRatio = async () => {
    let desiredRatio = '4:3'; // Start with the system default
    // This issue only affects Android
    if (Platform.OS === 'android') {
      const ratios = await camera.getSupportedRatiosAsync();

      // Calculate the width/height of each of the supported camera ratios
      // These width/height are measured in landscape mode
      // find the ratio that is closest to the screen ratio without going over
      let distances = {};
      let realRatios = {};
      let minDistance = null;
      for (const ratio of ratios) {
        const parts = ratio.split(':');
        const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
        realRatios[ratio] = realRatio;
        // ratio can't be taller than screen, so we don't want an abs()
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
      // set the best match
      desiredRatio = minDistance;
      //  calculate the difference between the camera width and the screen height
      const remainder = Math.floor((height - realRatios[desiredRatio] * width) / 2);
      // set the preview padding and preview ratio
      setImagePadding(remainder);
      setRatio(desiredRatio);
      // Set a flag so we don't do this
      // calculation each time the screen refreshes
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

  // the camera must be loaded in order to access the supported ratios
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
              
              <Icon icon={"cross"} onPress={()=>{goBack(); navigation.navigate("Gallery")}} size={40}></Icon>
              <Icon icon={"flash"} color={flashIconColor} onPress={() => {
                  flash === Camera.Constants.FlashMode.off
                  ? (setFlash(Camera.Constants.FlashMode.on), setFlashIconColor("yellow"), console.log(flash))
                  : (setFlash(Camera.Constants.FlashMode.off), setFlashIconColor("white"), console.log(flash))

              }} size={40}></Icon>
              {/* <Button onPress={savePicture}></Button> */}
            </View>
            <View style={styles.buttonContainer}>

              <Icon icon={"controller-stop"} onPress={goBack}size={60}></Icon>
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
    // justifyContent: 'flex-end',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    // alignSelf: 'center',
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
    // borderWidth: 10,
    // borderColor: 'pink'
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default MyCamera;