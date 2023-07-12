import * as React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons'

function IconButton({title, onPress, icon, color, size}) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Entypo name={icon} size={size ? size : 28} color={color ? color : '#f1f1f1'}/>
        </TouchableOpacity> 
        )
}

export default IconButton;