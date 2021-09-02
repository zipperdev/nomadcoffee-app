import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { View, ActivityIndicator, useWindowDimensions, FlatList } from "react-native";
import styled from "styled-components/native";
import { gql, useLazyQuery } from "@apollo/client";
import DismissKeyboard from "../components/DismissKeyboard";
import CoffeeShop from "../components/CoffeeShop";
import { client } from "../apollo";
import { light } from "../shared";

const SEARCH_QUERY = gql`
    query search($keyword: String!, $coffeeShopLastId: Int) {
        search(keyword: $keyword, coffeeShopLastId: $coffeeShopLastId) {
            coffeeShops {
                id
                name
                latitude
                longitude
                user {
                    id
                    avatarURL
                    username
                }
                photos {
                    id
                    url
                }
                categories {
                    id
                    name
                    slug
                }
                createdAt
            }
        }
    }
`;

const Input = styled.TextInput`
    background-color: ${props => props.theme.transparent};
    padding: 6px 8px;
    margin-bottom: 6px;
    border-radius: 5px;
    color: ${props => props.theme.fontColor};
    width: ${props => props.width / 1.095}px;
    align-self: center;
`;

const MessageContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 50px;
`;

const MessageText = styled.Text`
    margin-top: 20px;
    font-size: 16px;
    font-weight: 700;
`;

export default function Search({ navigation }) {
    const { width } = useWindowDimensions();
    const [ refreshing, setRefreshing ] = useState(false);
    const { setValue, handleSubmit, register } = useForm();
    const [ search, { loading, data, called, fetchMore, refetch } ] = useLazyQuery(SEARCH_QUERY);
    const SearchBox = () => <Input
        width={width}
        placeholderTextColor={light ? "#555555" : "#efefef"}
        selectionColor={light ? "#515151" : "#e1e1e1"}
        placeholder="Search coffee shops"
        autoCapitalize="none"
        returnKeyType="search"
        autoCorrect={false}
        onChangeText={text => setValue("keyword", text)}
        onSubmitEditing={handleSubmit(onSubmit)}
    />;
    useEffect(() => {
        navigation.setOptions({
            headerTitle: SearchBox
        });
        register("keyword", {
            required: true
        });
    }, []);
    const refresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };
    const onSubmit = formData => {
        search({
            variables: {
                keyword: formData.keyword
            }
        });
    };
    const renderCoffeeShop = ({ item }) => <CoffeeShop data={item} />;
    return (
        <DismissKeyboard>
            <View>
                {loading ? <MessageContainer>
                    <ActivityIndicator color={light ? "#101010" : "#fafafa"} size={30} />
                    <MessageText>Searching...</MessageText>
                </MessageContainer> : null}
                {!called ? <MessageContainer>
                    <MessageText>Search by keyword</MessageText>
                </MessageContainer>: null}
                {data?.search !== undefined ? (
                    data?.search?.coffeeShops.length === 0 ? (
                        <MessageContainer>
                            <MessageText>Could not find anything</MessageText>
                        </MessageContainer>
                    ) : (
                        <FlatList
                            onEndReachedThreshold={0.02}
                            onEndReached={() => fetchMore({
                                variables: {
                                    lastId: data?.search?.coffeeShops[data?.search?.coffeeShops.length - 1].id
                                }
                            })}
                            refreshing={refreshing}
                            onRefresh={() => {
                                client.cache.evict({ fieldName: "search" });
                                refresh();
                            }}
                            style={{ width: "100%" }}
                            showsVerticalScrollIndicator={false}
                            data={data?.search?.coffeeShops}
                            renderItem={renderCoffeeShop}
                            keyExtractor={coffeeShop => `${coffeeShop.id}`}
                        />
                    )
                ) : null}
            </View>
        </DismissKeyboard>
    );
};