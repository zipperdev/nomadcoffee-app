import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApolloClient, ApolloLink, InMemoryCache, makeVar } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
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
const onErrorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        console.log("GraphQL Error", graphQLErrors);
    };
    if (networkError) {
        console.log("Network Error", networkError);
    };
});

const coffeeShopMerge = (existing, incoming, { args }) => {
    if (args.hasOwnProperty("lastId") && !!args.lastId) {
        const merged = existing ? existing.slice(0) : [];
        const filteredMerged = merged.filter((value, index) => merged.indexOf(value) === index);
        const filteredIncoming = incoming.filter(value => !filteredMerged.some(item => item.__ref === value.__ref));
        return [ ...filteredMerged, ...filteredIncoming ];
    } else if (existing) {
        const merged = existing ? existing.slice(0) : [];
        const filteredMerged = merged.filter((value, index) => merged.indexOf(value) === index);
        const filteredIncoming = incoming.filter(value => !filteredMerged.some(item => item.__ref === value.__ref));
        return [ ...filteredMerged, ...filteredIncoming ];
    } else {
        return [ ...incoming ];
    };
};
export const client = new ApolloClient({
    link: ApolloLink.from([ authLink, onErrorLink, uploadLink ]), 
    cache: new InMemoryCache({
        typePolicies: {
            seeCoffeeShops: {
                keyArgs: false, 
                merge: coffeeShopMerge
            }, 
            search: {
                keyArgs: false, 
                merge(existing, incoming, { args })  {
                    const coffeeShopExisting = existing?.coffeeShops;
                    const userExisting = existing?.users;
                    const coffeeShopIncoming = incoming?.coffeeShops;
                    const userIncoming = incoming?.users;
                    if (args.hasOwnProperty("lastId") && !!args.lastId) {
                        const coffeeShopMerged = coffeeShopExisting ? coffeeShopExisting.slice(0) : [];
                        const userMerged = userExisting ? userExisting.slice(0) : [];
                        const coffeeShopFilteredMerged = coffeeShopMerged.filter((value, index) => coffeeShopMerged.indexOf(value) === index);
                        const userFilteredMerged = userMerged.filter((value, index) => userMerged.indexOf(value) === index);
                        const coffeeShopFilteredIncoming = coffeeShopIncoming.filter(value => !coffeeShopFilteredMerged.some(item => item.__ref === value.__ref));
                        const userFilteredIncoming = userIncoming.filter(value => !userFilteredMerged.some(item => item.__ref === value.__ref));
                        return {
                            coffeeShops: [
                                ...coffeeShopFilteredMerged, 
                                ...coffeeShopFilteredIncoming
                            ], 
                            users: [
                                ...userFilteredMerged, 
                                ...userFilteredIncoming
                            ]
                        };
                    } else {
                        return {
                            coffeeShops: [
                                ...coffeeShopIncoming
                            ], 
                            users: [
                                ...userIncoming
                            ]
                        };
                    };
                }
            }
        }
    })
});