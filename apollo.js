import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApolloClient, ApolloLink, InMemoryCache, makeVar } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";

export const AUTHENTICATION =  "authentication";

export const isLoggedInVar = makeVar(false);
export const authenticatedVar = makeVar("");

export const logUserIn = async (token, navigation) => {
    await AsyncStorage.setItem(AUTHENTICATION, token);
    if (authenticatedVar() === "") {
        authenticatedVar(token);
    };
    if (navigation) {
        navigation.navigate("Home");
    };
    isLoggedInVar(true);
};
export const logUserOut = async navigation => {
    await AsyncStorage.removeItem(AUTHENTICATION);
    authenticatedVar("");
    isLoggedInVar(false);
    if (navigation) {
        navigation.navigate("Home");
    };
};

const API_URI = "https://nomadcoffeeshop-backend.herokuapp.com/graphql";
const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers, 
            autorization: authenticatedVar()
        }
    };
});
const uploadLink = createUploadLink({
    uri: API_URI
});

export const client = new ApolloClient({
    link: ApolloLink.from([ authLink, uploadLink ]), 
    cache: new InMemoryCache()
});