import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SelectPhoto from "../screens/SelectPhoto";
import TakePhoto from "../screens/TakePhoto";
import { light } from "../shared";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

export default function UploadNav() {
    return <Tab.Navigator tabBarPosition="bottom" screenOptions={{
        tabBarStyle: {
            backgroundColor: light ? "#fefefe" : "#151515"
        }, 
        tabBarActiveTintColor: light ? "#101010" : "#fafafa", 
        tabBarIndicatorStyle: {
            backgroundColor: "#0095f6", 
            top: 0
        }
    }}>
        <Tab.Screen name="Select">
            {() => (
                <Stack.Navigator screenOptions={{
                    headerTintColor: light ? "#101010" : "#fafafa", 
                    headerBackTitleVisible: false,  
                    headerBackImage: ({ tintColor }) => <Ionicons color={tintColor} name="chevron-back" size={24} />, 
                    headerStyle: {
                        backgroundColor: light ? "#fefefe" : "#151515", 
                        shadowOpacity: 0.1
                    }
                }}>
                    <Stack.Screen name="SelectPhotos" options={{ title: "Choose photos" }} component={SelectPhoto} />
                </Stack.Navigator>
            )}
        </Tab.Screen>
        <Tab.Screen name="Take" component={TakePhoto} />
    </Tab.Navigator>;
};