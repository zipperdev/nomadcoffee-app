import React, { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import AuthLayout from "../components/auth/AuthLayout";
import AuthButton from "../components/auth/AuthButton";
import { TextInput, ErrorText, ButtonErrorText } from "../components/auth/AuthShared";
import { light } from "../shared";

const CREATE_ACCOUNT_MUTATION = gql`
    mutation createAccount($username: String!, $email: String!, $name: String!, $location: String!, $password: String!) {
        createAccount(username: $username, email: $email, name: $name, location: $location password: $password) {
            success
            error
        }
    }
`;

export default function Signup({ navigation }) {
    const emailRef = useRef();
    const nameRef = useRef();
    const locationRef = useRef();
    const passwordRef = useRef();
    const passwordConfrimRef = useRef();
    const { register, handleSubmit, setValue, getValues, watch, clearErrors, setError, formState: { errors } } = useForm();
    const [ createAccount, { loading } ] = useMutation(CREATE_ACCOUNT_MUTATION, {
        onCompleted: async data => {
            const { createAccount: { success, error } } = data;
            if (!success) {
                setError("result", {
                    message: error
                });
            } else {
                navigation.navigate("Login", {
                    username: watch("username"), 
                    password: watch("password")
                });
            };
        }
    });

    const onNext = element => {
        element?.current?.focus();
    };
    const onSubmit = data => {
        if (!loading) {
            createAccount({
                variables: {
                    username: data.username, 
                    email: data.email, 
                    name: data.name, 
                    location: data.location, 
                    password: data.password, 
                    passwordConfrim: data.passwordConfrim
                }
            });
        };
    };
    useEffect(() => {
        register("username", {
            required: "Username is required.", 
            maxLength: {
                value: 50, 
                message: "Username must be shorter than 50."
            }
        });
        register("email", {
            required: "Email address is required.", 
            maxLength: {
                value: 60, 
                message: "Email address must be shorter than 50."
            }, 
            pattern: {
                value: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i, 
                message: "Email address is invalid."
            }
        });
        register("name", {
            required: "Real name is required.", 
            maxLength: {
                value: 80, 
                message: "Real name must be shorter than 50."
            }
        });
        register("location", {
            required: "Location is required.", 
            maxLength: {
                value: 50, 
                message: "Location must be shorter than 50."
            }
        });
        register("password", {
            required: "Password is required.", 
            minLength: {
                value: 8, 
                message: "Password must be bigger than 7."
            }
        });
        register("passwordConfrim", {
            required: "Password confrimation is required.", 
            validate: currrentValue => {
                const { password } = getValues();
                return currrentValue === password ? null : "Password confrimation is not correct.";
            }
        });
    }, [register]);
    return <AuthLayout messageType="signup" navigation={navigation}>
        <TextInput placeholderTextColor={light ? "#555555" : "#efefef"} selectionColor={light ? "#515151" : "#e1e1e1"} value={watch("username")} autoCapitalize="none" placeholder="Username" returnKeyType="next" onSubmitEditing={() => onNext(emailRef)} onChangeText={text => setValue("username", text)} />
        {errors?.username ? (
            <ErrorText>{errors?.username?.message}</ErrorText>
        ) : null}
        <TextInput placeholderTextColor={light ? "#555555" : "#efefef"} selectionColor={light ? "#515151" : "#e1e1e1"} value={watch("email")} autoCapitalize="none" placeholder="Email Address" keyboardType="email-address" returnKeyType="next" ref={emailRef} onSubmitEditing={() => onNext(nameRef)} onChangeText={text => setValue("email", text)} />
        {errors?.email ? (
            <ErrorText>{errors?.email?.message}</ErrorText>
        ) : null}
        <TextInput placeholderTextColor={light ? "#555555" : "#efefef"} selectionColor={light ? "#515151" : "#e1e1e1"} value={watch("name")} autoCapitalize="none" placeholder="Real Name" returnKeyType="next" ref={nameRef} onSubmitEditing={() => onNext(locationRef)} onChangeText={text => setValue("name", text)} />
        {errors?.name ? (
            <ErrorText>{errors?.name?.message}</ErrorText>
        ) : null}
        <TextInput placeholderTextColor={light ? "#555555" : "#efefef"} selectionColor={light ? "#515151" : "#e1e1e1"} value={watch("location")} autoCapitalize="none" placeholder="Location" returnKeyType="next" ref={locationRef} onSubmitEditing={() => onNext(passwordRef)} onChangeText={text => setValue("location", text)} />
        {errors?.location ? (
            <ErrorText>{errors?.location?.message}</ErrorText>
        ) : null}
        <TextInput placeholderTextColor={light ? "#555555" : "#efefef"} selectionColor={light ? "#515151" : "#e1e1e1"} value={watch("password")} autoCapitalize="none" placeholder="Password" keyboardType="default" ref={passwordRef} secureTextEntry={true} returnKeyType="next" onSubmitEditing={() => onNext(passwordConfrimRef)} onChangeText={text => setValue("password", text)} />
        {errors?.password ? (
            <ErrorText>{errors?.password?.message}</ErrorText>
        ) : null}
        <TextInput placeholderTextColor={light ? "#555555" : "#efefef"} selectionColor={light ? "#515151" : "#e1e1e1"} value={watch("passwordConfrim")} autoCapitalize="none" placeholder="Password Confrim" keyboardType="default" ref={passwordConfrimRef} secureTextEntry={true} returnKeyType="done" onSubmitEditing={handleSubmit(onSubmit)} onChangeText={text => setValue("passwordConfrim", text)} />
        {errors?.passwordConfrim ? (
            <ErrorText>{errors?.passwordConfrim?.message}</ErrorText>
        ) : null}
        <AuthButton loading={loading} disabled={(!watch("username") || !watch("email") || !watch("name") || !watch("location") || !watch("password") || !watch("passwordConfrim")) || loading} onPress={() => {
            clearErrors("result");
            handleSubmit(onSubmit)();
        }} text="Sign Up" />
        {errors?.result ? (
            <ButtonErrorText>{errors?.result?.message}</ButtonErrorText>
        ) : null}
    </AuthLayout>;
};