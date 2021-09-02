import React, { useState } from "react";
import { AppearanceProvider } from "react-native-appearance";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from "styled-components/native";
import { ApolloProvider } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import MainNav from "./navigators/MainNav";
import { darkTheme, lightTheme, navigationTheme } from "./styles";
import { authenticatedVar, isLoggedInVar, AUTHENTICATION, client } from "./apollo";
import { light } from "./shared";

function App() {
    const [ loading, setLoading ] = useState(true);
    const preload = async () => {
        const token = await AsyncStorage.getItem(AUTHENTICATION);
        if (token) {
            isLoggedInVar(true);
            authenticatedVar(token);
        };
        const fonts = [Ionicons.font];
        const images = [require("./assets/nullAvatar.png"), require("./assets/logo_black.png"), require("./assets/logo_white.png")];
        const fontPromise = fonts.map(font => Font.loadAsync(font));
        const imagePromise = images.map(image => Asset.loadAsync(image));
        return Promise.all([ ...fontPromise, ...imagePromise ]);
    };
    if (loading) {
        return <AppLoading
            startAsync={preload}
            onFinish={() => setLoading(false)}
            onError={console.warn}
        />;
    };
    return <ApolloProvider client={client}>
        <AppearanceProvider>
            <ThemeProvider theme={light ? lightTheme : darkTheme}>
                <NavigationContainer theme={navigationTheme}>
                    <MainNav />
                </NavigationContainer>
            </ThemeProvider>
        </AppearanceProvider>
    </ApolloProvider>;
};


export default App;