import React from "react";
import { TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/core";
import { Ionicons } from "@expo/vector-icons";
import UploadForm from "../screens/UploadForm";
import { light } from "../shared";
import UploadNav from "./UploadNav";
import TabsNav from "./TabsNav";

const Stack = createStackNavigator();

export default function MainNav() {
    const navigation = useNavigation();
    return <Stack.Navigator initialRouteName="Tabs">
        <Stack.Screen name="Tabs" options={{
            headerMode: "screen", 
            headerBackTitleVisible: false, 
            headerTitle: false, 
            headerTransparent: true, 
            headerShown: false
        }} component={TabsNav} />
        <Stack.Screen name="Upload" options={{
            headerMode: "screen", 
            headerBackTitleVisible: false, 
            headerTitle: false, 
            headerTransparent: true, 
            headerShown: false
        }} component={UploadNav} />
        <Stack.Screen name="UploadForm" options={{
            title: "Upload Coffee Shop", 
            headerTintColor: light ? "#000000" : "#ffffff", 
            headerBackTitleVisible: false, 
            headerLeft: ({ tintColor }) => <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {
                navigation.navigate("Tabs");
                navigation.navigate("Upload");
            }}>
                <Ionicons color={tintColor} name="chevron-back" size={24} />
            </TouchableOpacity>
        }} component={UploadForm} />
    </Stack.Navigator>;
};