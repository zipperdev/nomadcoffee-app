import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import { light } from "../shared";

const Stacks = createStackNavigator();

export default function AuthNav() {
    return <Stacks.Navigator initialRouteName="Login" screenOptions={{
            headerBackTitleVisible: false, 
            headerTitle: false, 
            headerTransparent: true, 
            headerTintColor: light ? "#000000" : "#ffffff", 
            headerShown: false
        }}>
            <Stacks.Screen name="Login" component={Login} />
            <Stacks.Screen name="Signup" component={Signup} />
    </Stacks.Navigator>;
};