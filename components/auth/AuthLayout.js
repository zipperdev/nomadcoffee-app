import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import PropTypes from "prop-types";
import styled from "styled-components/native";
import { light } from "../../shared";
import DismissKeyboard from "../DismissKeyboard";

const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.bgColor};
    padding: 0 40px;
`;

const Logo = styled.Image`
    max-width: 80%;
    height: 180px;
    margin: 0 auto;
`;

const BottomBox = styled.View`
    flex-direction: row;
    width: 100%;
    margin-top: 20px;
    border-top-color: ${props => props.theme.borderColor};
    border-top-width: 1.6px;
`;

const Text = styled.Text`
    margin-top: 10px;
    color: ${props => props.theme.fontColor};
`;

const Link = styled.TouchableOpacity`
    margin-top: 10px;
    margin-left: 6px;
`;

const LinkText = styled.Text`
    color: ${props => props.theme.accent};
`;

function AuthLayout({ children, messageType, navigation }) {
    return <DismissKeyboard>
        <Container>
            <KeyboardAvoidingView style={{ width: "100%" }} behavior={Platform.OS === "ios" ? "position" : "padding"} keyboardVerticalOffset={Platform.OS === "ios" ? 50 : -10}>
                <Logo resizeMode="center" source={light ? require("../../assets/logo_black.png") : require("../../assets/logo_white.png")} />
                {children}
                <BottomBox>
                    <Text>{messageType === "login" ? "Don't have an account?" : "Already have an account?"}</Text>
                    <Link onPress={() => {
                        navigation.navigate(messageType === "login" ? "Signup" : "Login");
                    }}>
                        <LinkText>
                            {messageType === "login" ? "Sign Up" : "Log In"}
                        </LinkText>
                    </Link>
                </BottomBox>
            </KeyboardAvoidingView>
        </Container>
    </DismissKeyboard>;
};

AuthLayout.propTypes = {
    children: PropTypes.node.isRequired, 
    messageType: PropTypes.string.isRequired, 
    navigation: PropTypes.any.isRequired
};

export default AuthLayout;