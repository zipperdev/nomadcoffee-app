import React, { useState } from "react";
import { FlatList, Text } from "react-native";
import { gql, useQuery } from "@apollo/client";
import ScreenLayout from "../components/ScreenLayout";
import CoffeeShop from "../components/CoffeeShop";
import { client } from "../apollo";

const SEE_COFFEE_SHOPS_QUERY = gql`
    query seeCoffeeShops($lastId: Int) {
        seeCoffeeShops(lastId: $lastId) {
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
`;

export default function Home() {
    const { data, loading, refetch, fetchMore } = useQuery(SEE_COFFEE_SHOPS_QUERY);
    const [ refreshing, setRefreshing ] = useState(false);
    const refresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };
    const renderCoffeeShop = ({ item }) => <CoffeeShop data={item} />;

    return <ScreenLayout loading={loading}>
        <FlatList
            onEndReachedThreshold={0.02}
            onEndReached={() => fetchMore({
                variables: {
                    lastId: data?.seeCoffeeShops[0].id
                }
            })}
            refreshing={refreshing}
            onRefresh={() => {
                client.cache.evict({ fieldName: "seeCoffeeShops" });
                refresh();
            }}
            style={{ width: "100%" }}
            showsVerticalScrollIndicator={false}
            data={data?.seeCoffeeShops}
            renderItem={renderCoffeeShop}
            keyExtractor={coffeeShop => `${coffeeShop.id}`}
        />
    </ScreenLayout>;
};