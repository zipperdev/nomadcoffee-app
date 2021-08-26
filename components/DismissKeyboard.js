import React from "react";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import PropTypes from "prop-types";

function DismissKeyboard({ children }) {
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };
    return <TouchableWithoutFeedback style={{ height: "100%" }} onPress={dismissKeyboard} disabled={Platform.OS === "web"}>
        {children}
    </TouchableWithoutFeedback>;
};

DismissKeyboard.propTypes = {
    children: PropTypes.node.isRequired
};

export default DismissKeyboard;