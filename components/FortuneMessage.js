import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StyleManager from "./animations/styles/StyleManager";
import { useState, useEffect } from "react";

function FortuneMessage({fortune, style}) {
    const [message, setMessage] = useState(null);
    const [theme, setTheme] = useState(null);
    const [styles, setStyles] = useState(StyleManager({theme: theme}));
    fortune = JSON.parse(fortune);
    useEffect(() => {
        const updateStyles = async () => {
            setStyles(StyleManager({ theme: fortune.theme }));
            setTheme(fortune.theme);
            setMessage(fortune.wish);
        }

        updateStyles();
    }, []);   

    return (
      <View style={StyleSheet.compose(styles.container, style)}>
          <TouchableOpacity onPress={() => console.log()}>
            <Text style={StyleSheet.compose(styles.text, {fontSize: styles.text.fontSize - 25, lineHeight: styles.text.lineHeight - 30 })}>{message}</Text>
          </TouchableOpacity>
      </View>
    );
}

export default FortuneMessage;
