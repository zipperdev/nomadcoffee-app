import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useReactiveVar } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import StackNavFactory from "../components/nav/StackNavFactory";
import { isLoggedInVar } from "../apollo";
import { light } from "../shared";
import AuthNav from "./AuthNav";

const Tabs = createBottomTabNavigator();

export default function MainNav() {
    const isLoggedIn = useReactiveVar(isLoggedInVar);
    return <Tabs.Navigator screenOptions={{
            tabBarHideOnKeyboard: true, 
            tabBarActiveTintColor: light ? "#262626" : "#ffffff", 
            tabBarInactiveTintColor: light ? "#b3b3b3" : "#e1e1e1", 
            tabBarShowLabel: false, 
            tabBarActiveBackgroundColor: light ? "#fafafa" : "#101010", 
            tabBarInactiveBackgroundColor: light ? "#fafafa" : "#101010", 
            headerStyle: {
                width: "100%", 
                elevation: 0, 
                shadowOpacity: 0, 
                borderBottomColor: light ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.2)", 
                backgroundColor: light ? "#FFFFFF" : "#000000"
            }, 
            headerBackTitleVisible: false, 
            headerTitle: false, 
            headerTransparent: true, 
            headerTintColor: light ? "#000000" : "#FFFFFF", 
            headerShown: false
    }}>
        <Tabs.Screen name="HomeTab" options={{
            tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? "home" : "home-outline"} color={color} size={22} />
        }}>
            {() => <StackNavFactory screenName="Home" />}
        </Tabs.Screen>
        <Tabs.Screen name="SearchTab" options={{
            tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? "search" : "search-outline"} color={color} size={22} />
        }}>
            {() => <StackNavFactory screenName="Search" />}
        </Tabs.Screen>
        <Tabs.Screen name="ProfileTab" options={{
            ...(!isLoggedIn && {
                headerBackTitleVisible: false, 
                headerTitle: false, 
                headerTransparent: true, 
                headerTintColor: light ? "#000000" : "#FFFFFF", 
                headerShown: false
            }), 
            tabBarIcon: ({ focused, color }) => <Ionicons name={isLoggedIn ? (focused ? "person" : "person-outline") : (focused ? "log-in" : "log-in-outline")} color={color} size={isLoggedIn ? 22 : 26} />
        }}>
            {isLoggedIn ? () => <StackNavFactory screenName="Profile" /> : AuthNav}
        </Tabs.Screen>
    </Tabs.Navigator>;
};