import { DefaultTheme } from "@react-navigation/native";
import { light } from './shared';

export const lightTheme = {
    bgColor: "#fafafa", 
    fontColor: "#555555", 
    mudColor: "#ffffff", 
    swapColor: "#2c2c2c", 
    weightColor: "#303030", 
    accent: "#0095f6", 
    focusBorderColor: "rgb(38, 38, 38)", 
    borderColor: "rgb(219, 219, 219)", 
    transparent: "rgba(0, 0, 0, 0.05)"
};

export const darkTheme = {
    bgColor: "#101010", 
    fontColor: "#efefef", 
    mudColor: "#242424", 
    swapColor: "#eaeaea", 
    weightColor: "#e0e0e0", 
    accent: "#0095f6", 
    focusBorderColor: "rgb(80, 80, 80)", 
    borderColor: "rgb(28, 28, 28)", 
    transparent: "rgba(255, 255, 255, 0.15)"
};

export const navigationTheme = {
    ...DefaultTheme, 
    colors: {
        ...DefaultTheme.colors, 
        background: light ? "#fafafa" : "#101010"
    }
};