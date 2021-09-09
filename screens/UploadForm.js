import React, { useEffect, useState } from "react";
import { TouchableOpacity, ActivityIndicator, ToastAndroid } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { gql, useMutation } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import DismissKeyboard from "../components/DismissKeyboard";
import { light } from "../shared";

const CREATE_COFFEE_SHOP_MUTATION = gql`
    mutation createCoffeeShop($name: String!, $latitude: String!, $longitude: String!, $photos: [Upload], $categories: [String]) {
        createCoffeeShop(name: $name, latitude: $latitude, longitude: $longitude, photos: $photos, categories: $categories) {
            success
            error
            coffeeShop {
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

const Container = styled.ScrollView`
    flex: 1;
    width: 100%;
    background-color: ${props => props.theme.bgColor};
    padding: 10px;
`;

const PhotosText = styled.Text`
    font-size: 22px;
    font-weight: 700;
    margin-left: 14px;
    margin-bottom: -10px;
`;

const PhotosContainer = styled.View`
    width: 100%;
    padding: 14px 5px;
`;

const Photos = styled.ScrollView`
    display: flex;
    width: 100%;
    flex-direction: row;
`;

const Photo = styled.Image`
    width: 120px;
    height: 120px;
    margin: 5px;
    border-radius: 8px;
`;

const FormContainer = styled.View`
    width: 100%;
`;

const Name = styled.TextInput`
    background-color: ${props => props.theme.transparent};
    padding: 8px 10px;
    margin-bottom: 6px;
    border-radius: 4px;
    width: 97.4%;
    align-self: center;
    color: ${props => props.theme.fontColor};
`;

const CategoryContainer = styled.View`
    width: 100%;
`;

const CategoryInput = styled.TextInput`
    background-color: ${props => props.theme.transparent};
    padding: 6px 10px;
    margin-bottom: 6px;
    border-radius: 6px;
    width: 97.4%;
    align-self: center;
    color: ${props => props.theme.fontColor};
`;

const CategoryScrollView = styled.ScrollView`
    display: flex;
    width: 100%;
    height: 90px;
    padding: 0 8px;
`;

const Category = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 97.4%;
    align-self: center;
`;

const CategoryText = styled.Text`
    font-weight: 700;
    font-size: 18px;
`;

const CategoryRemoveBtn = styled.TouchableOpacity`
    padding: 2px 0 2px 2px;
`;

const MapText = styled.Text`
    font-size: 16px;
    color: ${props => props.theme.accent};
    margin-left: 5px;
    margin-bottom: 10px;
`;

const Map = styled(MapView)`
    width: 97.4%;
    height: 300px;
    border-radius: 10px;
    align-self: center;
`;

const Button = styled.TouchableOpacity`
    background-color: ${props => props.theme.accent};
    padding: 12px;
    border-radius: 5px;
    width: 97.4%;
    opacity: ${props => props.disabled ? "0.5" : "1"};
    align-self: center;
`;

const ButtonText = styled.Text`
    color: #ffffff;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
`;

const HeaderRightText = styled.Text`
    color: ${props => props.theme.accent};
    font-size: 17px;
    font-weight: 600;
    margin-right: 18px;
`;

export default function UploadForm({ route, navigation }) {
    const [ uploadCoffeeShop, { loading } ] = useMutation(CREATE_COFFEE_SHOP_MUTATION, {
        update: (cache, result) => {
            const { data: { createCoffeeShop } } = result;
            if (createCoffeeShop.coffeeShop.id) {
                cache.modify({
                    id: "ROOT_QUERY", 
                    fields: {
                        seeCoffeeShops(prev) {
                            return [ createCoffeeShop.coffeeShop, ...prev ];
                        }
                    }
                });
                navigation.navigate("Tabs");
            };
        }
    });
    const { register, handleSubmit, setValue, watch } = useForm();
    const [ categories, setCategories ] = useState([]);
    const [ categoryInput, setCategoryInput ] = useState("");
    const [ position, setPosition ] = useState({ latitude: 37.517235, longitude: 127.047325 });

    const HeaderRight = () => <TouchableOpacity onPress={handleSubmit(onValid)}>
        <HeaderRightText>Next</HeaderRightText>
    </TouchableOpacity>;
    const HeaderRightLoading = () => <ActivityIndicator size={20} color="#0095f6" style={{ marginRight: 10 }} />;
    useEffect(() => {
        register("name");
    }, [register]);
    useEffect(() => {
        navigation.setOptions({
            headerRight: loading ? HeaderRightLoading : HeaderRight, 
            ...(loading && { headerLeft: () => null })
        });
    }, [loading]);
    const addCategory = text => {
        if (!categories.includes(text.nativeEvent.text)) {
            setCategoryInput("");
            setCategories([ ...categories, text.nativeEvent.text ]);
        };
    };
    const removeCategory = value => setCategories(categories.filter((_, index) => index !== value));
    const onValid = ({ name }) => {
        const { latitude, longitude } = position;
        if (!name) {
            return ToastAndroid.show("Coffee shop name is required", ToastAndroid.BOTTOM);
        } else if (!latitude || !longitude) {
            return ToastAndroid.show("Error on Map API :(", ToastAndroid.BOTTOM);
        } else if (!route.params.files[0]) {
            return ToastAndroid.show("Error on MediaLibrary or Camera API :(", ToastAndroid.BOTTOM);
        } else {
            let files = [];
            route.params.files.map((value, index) => {
                const file = new ReactNativeFile({
                    uri: value, 
                    name: `${index}-${Date.now()}.jpeg`, 
                    type: "image/jpeg"
                });
                files.push(file);
            });
            uploadCoffeeShop({
                variables: {
                    name, 
                    latitude: String(latitude), 
                    longitude: String(longitude), 
                    photos: files, 
                    categories
                }
            });
        };
    };
    return <DismissKeyboard>
        <Container>
            <PhotosText>Photos</PhotosText>
            <PhotosContainer>
                <Photos horizontal={true} showHorizontalScrollIndicator={false}>
                    {route.params.files.map((value, index) => <Photo key={index} source={{ uri: value }} />)}
                </Photos>
            </PhotosContainer>
            <FormContainer>
                <Name placeholderTextColor={light ? "#555555" : "#efefef"} selectionColor={light ? "#515151" : "#e1e1e1"} autoCapitalize="none" placeholder="Name" keyboardType="default" onChangeText={text => setValue("name", text)} />
                <Map
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                        latitude: 37.517235, 
                        longitude: 127.047325, 
                        latitudeDelta: 0.0922, 
                        longitudeDelta: 0.0421
                    }}
                >
                    <Marker
                        draggable
                        coordinate={{
                            latitude: 37.517235, 
                            longitude: 127.047325, 
                            latitudeDelta: 0.0922, 
                            longitudeDelta: 0.0421
                        }}
                        onDragEnd={event => setPosition(event.nativeEvent.coordinate)}
                    />
                </Map>
                <MapText>Hold marker to select your coffee shop position</MapText>
                    <CategoryInput value={categoryInput} placeholderTextColor={light ? "#555555" : "#efefef"} selectionColor={light ? "#515151" : "#e1e1e1"} autoCapitalize="none" placeholder="Type enter to add category" onChangeText={text => setCategoryInput(text)} onSubmitEditing={addCategory} keyboardType="default" />
                <CategoryContainer>
                    <CategoryScrollView vertical={true} showVerticalScrollIndicator={false}>
                        {!categories[0] ? <CategoryText>Add some categories</CategoryText> : null}
                        {categories.map((value, index) => (
                            <Category key={index}>
                                <CategoryText>{value}</CategoryText>
                                <CategoryRemoveBtn onPress={() => removeCategory(index)}>
                                    <Ionicons name="close" color="#ff471a" size={22} />
                                </CategoryRemoveBtn>
                            </Category>
                        ))}
                    </CategoryScrollView>
                </CategoryContainer>
                <Button disabled={loading || !watch("name")} onPress={handleSubmit(onValid)}>
                    {loading ? <ActivityIndicator color="#ffffff" /> : <ButtonText>Next</ButtonText>}
                </Button>
            </FormContainer>
        </Container>
    </DismissKeyboard>;
};