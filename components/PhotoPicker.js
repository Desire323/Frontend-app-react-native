import React, {useState, useEffect} from 'react';
import { View, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Constants } from 'expo-image-picker';

function PhotoPicker() {
    const [image, setImage] = useState(null);
    
    useEffect( async () => {
        if (Platform.OS !== 'web'){
            const { status } = await ImagePicker.requestMediaLibraryPermissionAsync();
            if (status !== 'granted') {
                alert('Permission denied')
            }
        }
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1
        })
        console.log(result)
        if(!result.cancelled) {
            setImage(result.uri)
        }
    }
    return (
        <View>
            <Button title={"Choose Image"} onPress={pickImage}>
            {image && <Image source={{uri:image}} style={{
                width:200,
                height:200
            }}/>}
            </Button>
        </View>
    );
}

export default PhotoPicker;