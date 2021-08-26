import React from "react";
import { ActivityIndicator } from "react-native";
import PropTypes from "prop-types";
import styled from "styled-components/native";

const Button = styled.TouchableOpacity`
    background-color: ${props => props.theme.accent};
    margin-top: 20px;
    padding: 12px;
    border-radius: 5px;
    width: 100%;
    opacity: ${props => props.disabled ? "0.5" : "1"};
`;

const ButtonText = styled.Text`
    color: #ffffff;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
`;

function AuthButton({ onPress, disabled, text, loading }) {
    return <Button disabled={disabled} onPress={onPress}>
        {loading ? <ActivityIndicator color="#FFFFFF" /> : <ButtonText>{text}</ButtonText>}
    </Button>;
};

AuthButton.propTypes = {
    onPress: PropTypes.func.isRequired, 
    disabled: PropTypes.bool, 
    text: PropTypes.string.isRequired, 
    loading: PropTypes.bool
};

export default AuthButton;