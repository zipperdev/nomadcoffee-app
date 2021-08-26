import React, { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import AuthLayout from "../components/auth/AuthLayout";
import AuthButton from "../components/auth/AuthButton";
import { TextInput, ErrorText, ButtonErrorText } from "../components/auth/AuthShared";
import { logUserIn } from "../apollo";
import { light } from "../shared";

const LOGIN_MUTATION = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            success
            token
            error
        }
    }
`;

export default function Login({ navigation, route: { params } }) {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const { register, handleSubmit, setValue, watch, clearErrors, setError, formState: { errors } } = useForm();
    const [ login, { loading } ] = useMutation(LOGIN_MUTATION, {
        onCompleted: async data => {
            const { login: { success, token, error } } = data;
            if (!success) {
                setError("result", {
                    message: error
                });
            } else {
                await logUserIn(String(token), navigation);
            };
        }
    });
    
    useEffect(() => {
        setValue("username", params?.username);
        setValue("password", params?.password);
    }, [params]);
    const onNext = element => {
        element?.current?.focus();
    };
    const onSubmit = data => {
        if (!loading) {
            login({
                variables: {
                    username: data.username, 
                    password: data.password
                }
            });
        };
    };
    useEffect(() => {
        register("username", {
            required: "Username is required."
        });
        register("password", {
            required: "Password is required."
        });
    }, [register]);
    return <AuthLayout messageType="login" navigation={navigation}>
        <TextInput placeholderTextColor={light ? "#555555" : "#efefef"} selectionColor={light ? "#515151" : "#e1e1e1"} defaultValue={params?.username} value={watch("username")} autoCapitalize="none" placeholder="Username" returnKeyType="next" ref={usernameRef} onSubmitEditing={() => onNext(passwordRef)} onChangeText={text => setValue("username", text)} />
        {errors?.username ? (
            <ErrorText>{errors?.username?.message}</ErrorText>
        ) : null}
        <TextInput placeholderTextColor={light ? "#555555" : "#efefef"} selectionColor={light ? "#515151" : "#e1e1e1"} defaultValue={params?.password} value={watch("password")} autoCapitalize="none" placeholder="Password" keyboardType="default" ref={passwordRef} secureTextEntry={true} returnKeyType="done" onSubmitEditing={handleSubmit(onSubmit)} onChangeText={text => setValue("password", text)} />
        {errors?.password ? (
            <ErrorText>{errors?.password?.message}</ErrorText>
        ) : null}
        <AuthButton loading={loading} disabled={(!watch("username") || !watch("password")) || loading} onPress={() => {
            clearErrors("result");
            handleSubmit(onSubmit)();
        }} text="Log In" />
        {errors?.result ? (
            <ButtonErrorText>{errors?.result?.message}</ButtonErrorText>
        ) : null}
    </AuthLayout>;
};