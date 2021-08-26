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
    let id = null;
    const token = useReactiveVar(authenticatedVar);
    const isLoggedIn = useReactiveVar(isLoggedInVar);
    if (token) {
        const decodedToken = jwtDecode(token);
        id = decodedToken.id;
    };
    const { data } = useQuery(SEE_PROFILE_QUERY, {
        skip: !token, 
        variables: {
            id
        }
    });
    useEffect(() => {
        if (data?.seeProfile === null) {
            return logUserOut();
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
        return logUserOut();
    };
};