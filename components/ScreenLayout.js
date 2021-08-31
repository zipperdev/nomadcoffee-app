import React from "react";
import { ActivityIndicator, View } from "react-native";
import PropTypes from "prop-types";
import { light } from "../shared";

function ScreenLayout({ loading, children }) {
    return <View style={{
        flex: 1, 
        alignItems: "center", 
        justifyContent: "center"
    }}>
        {loading ? <ActivityIndicator color={light ? "#ffffff" : "#000000"} /> : children}
    </View>;
};

ScreenLayout.propTypes = {
    loading: PropTypes.bool.isRequired
};

export default ScreenLayout;