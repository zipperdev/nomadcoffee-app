import styled from "styled-components/native";

export const TextInput = styled.TextInput`
    background-color: ${props => props.theme.transparent};
    padding: 8px 10px;
    margin-bottom: 6px;
    border-radius: 4px;
    color: ${props => props.theme.fontColor};
`;

export const ErrorText = styled.Text`
    margin-top: -6px;
    font-size: 12px;
    font-weight: 600;
    color: #ff471a;
`;

export const ButtonErrorText = styled.Text`
    margin-top: 2px;
    font-size: 12px;
    font-weight: 600;
    color: #ff471a;
`;