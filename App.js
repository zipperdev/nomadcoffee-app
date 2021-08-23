import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { StatusBar } from "expo-status-bar";

export default function App() {
    const [ loading, setLoading ] = useState(true);
    const preload = () => {
        const fonts = [Ionicons.font];
        const images = [require("./assets/logo.png")];
        const fontPromise = fonts.map(font => Font.loadAsync(font));
        const imagePromise = images.map(image => Asset.loadAsync(image));
        return Promise.all([ ...fontPromise, ...imagePromise ]);
    };
    if (loading) {
        return <AppLoading startAsync={preload} onFinish={() => setLoading(false)} onError={console.warn} />
    };
    return (
        <View style={styles.container}>
            <Text>Nomad X Coffee Application</Text>
            <StatusBar style="auto" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: "#fff", 
        alignItems: "center", 
        justifyContent: "center"
    }
});
