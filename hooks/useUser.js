import { useEffect } from "react";
import jwtDecode from "jwt-decode";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { authenticatedVar, isLoggedInVar, logUserOut } from "../apollo";

const SEE_PROFILE_QUERY = gql`
    query seeProfile($id: Int!) {
        seeProfile(id: $id) {
            id
            username
            email
            name
            location
            totalFollowers
            totalFollowing
            isFollowing
            isMe
            avatarURL
            githubUsername
            createdAt
        }
    }
`;

export const useUser = () => {
    const dumpToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkdW1wIjoiZmlsZSJ9.dzqoK0vJQPSWshv4YEkpDd4UNjGRb5BYoBUV6p3H9Co";
    const token = useReactiveVar(authenticatedVar);
    const isLoggedIn = useReactiveVar(isLoggedInVar);
    const decodedToken = jwtDecode(token ? token : dumpToken);
    const { data } = useQuery(SEE_PROFILE_QUERY, {
        skip: !token || !decodedToken?.id, 
        variables: {
            id: decodedToken.id
        }
    });
    useEffect(() => {
        if (data?.seeProfile === null) {
            return {
                data: null
            };
        };
    }, [data]);
    if (token && isLoggedIn) {
        return {
            data
        };
    } else if (isLoggedIn) {
        return {
            data: null
        };
    } else {
        return {
            data: null
        };
    };
};