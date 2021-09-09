import React, { useEffect, useState, useRef } from "react";
import { TouchableOpacity, ActivityIndicator, Image, ToastAndroid, Alert } from "react-native";
import styled from "styled-components/native";
import Slider from "@react-native-community/slider";
import { useIsFocused } from "@react-navigation/core";
import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import * as MediaLibrary from "expo-media-library";
import { light } from "../shared";

const Container = styled.View`
    flex: 1;
    background-color: ${props => props.theme.bgColor};
`;

const ReaskPermissionBtn = styled.TouchableOpacity`
    padding: 47px 12px 15px;
    background-color: ${props => props.theme.accent};
`;

const ReackPermissionText = styled.Text`
    width: 100%;
    text-align: center;
    font-weight: 700;
    font-size: 16px;
    color: #ffffff;
`;

const Actions = styled.View`
    flex: 0.22;
    padding: 0px 50px;
    height: 100%;
    align-items: center;
    justify-content: center;
`;

const ButtonsContainer = styled.View`
    width: 100%;
    margin-top: -160px;
    height: 20px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const TakePhotoBtn = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 54px;
    height: 54px;
    background-color: rgba(220, 220, 220, 0.3);
    border: 4px solid rgba(220, 220, 220, 0.5);
    border-radius: 50px;
`;

const SliderContainer = styled.View`
    margin-top: -200px;
`;

const ActionsContainer = styled.View`
    padding: 2px;
`;

const CloseButton = styled.TouchableOpacity`
    position: absolute;
    top: 50px;
    left: 20px;
`;

const NextButton = styled.TouchableOpacity`
    position: absolute;
    top: 48px;
    right: 20px;
    background-color: ${props => props.theme.accent};
    padding: 6px 10px;
    border-radius: 3px;
`;

const NextButtonText = styled.Text`
    color: #ffffff;
    font-size: 16px;
`;

const Images = styled.ScrollView`
    display: flex;
    width: 100%;
    flex-direction: row;
    z-index: 1;
`;

const ContainerImg = styled.View`
    flex: 0.22;
    width: 100%;
    padding: 0 10px;
`;

const PhotoBox = styled.TouchableOpacity`
    position: relative;
    flex: 1;
    width: 100px;
    height: 100px;
    margin: 14px 7px;
`;

const PhotoImage = styled.Image`
    width: 100px;
    height: 100px;
    border-radius: 8px;
`;

const RemovePhotoBtn = styled.TouchableOpacity`
    padding: 2px;
    position: absolute;
    top: 2px;
    left: 2px;
`;

const ReturnOverviewBtn = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 14px 30px;
    background-color: ${props => props.theme.accent};
    border-radius: 8px;
`;

const ReturnOverviewText = styled.Text`
    font-size: 18px;
    font-weight: 700;
    color: #fafafa;
`;

export default function TakePhoto({ navigation }) {
    const camera = useRef();
    const isFocused = useIsFocused();
    const [ zoom, setZoom ] = useState(0);
    const [ flashMode, setFlashMode ] = useState(Camera.Constants.FlashMode.off);
    const [ cameraType, setCameraType ] = useState(Camera.Constants.Type.back);
    const [ cameraReady, setCameraReady ] = useState(false);
    const [ success, setSuccess ] = useState(false);
    const [ photos, setPhotos ] = useState([]);
    const [ overviewPhoto, setOverviewPhoto ] = useState(null);
    const getPermissions = async () => {
        const permissionObj = await Camera.requestCameraPermissionsAsync();
        setSuccess(permissionObj.granted === true);
    };
    const changeCameraType = () => setCameraType(cameraType === Camera.Constants.Type.front ? Camera.Constants.Type.back : Camera.Constants.Type.front);
    const changeZoom = event => setZoom(event);
    const changeFlashMode = () => setFlashMode(flashMode === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.torch : flashMode === Camera.Constants.FlashMode.torch ? Camera.Constants.FlashMode.off : Camera.Constants.FlashMode.off);
    const takePhoto = async () => {
        if (photos.length < 10) {
            if (camera.current && cameraReady) {
                setCameraReady(false);
                let photo = await camera.current.takePictureAsync({
                    quality: 0.6, 
                    exif: true
                });
                setPhotos([ photo.uri, ...photos ]);
                setCameraReady(true);
            };
        } else {
            ToastAndroid.show("Images must be less than 10", ToastAndroid.BOTTOM);
        };
    };
    const removePhoto = value => setPhotos(photos.filter((_, index) => index !== value));
    const seeOverviewPhoto = value => setOverviewPhoto(photos[value]);
    const getOutOverviewPhoto = () => setOverviewPhoto(null);
    const changeCameraReady = () => setCameraReady(true);
    const nextStepUpload = async upload => {
        if (upload) {
            for (let i = 0; i < photos.length; i++) {
                await MediaLibrary.saveToLibraryAsync(photos[i]);
            };
        };
        navigation.navigate("UploadForm", {
            files: photos
        });
    };
    const nextStep = () => {
        if (!photos[0]) {
            ToastAndroid.show("You must select images at least one", ToastAndroid.BOTTOM);
        } else {
            Alert.alert(
                "Save photos?", 
                "Save photos and Upload or Just Upload", 
                [
                    {
                        text: "Save and Upload", 
                        onPress: () => nextStepUpload(true), 
                        style: "default"
                    }, 
                    {
                        text: "Just Upload", 
                        onPress: () => nextStepUpload(false), 
                        style: "default"
                    }
                ], 
                {
                    cancelable: true
                }
            );
        };
    };
    useEffect(() => {
        getPermissions();
    }, []);
    return <Container>
        {isFocused ? <StatusBar style="inverted" /> : null}
        {!success ? (
            <ReaskPermissionBtn>
                <ReackPermissionText onPress={getPermissions}>Request Premission</ReackPermissionText>
            </ReaskPermissionBtn>
        ) : null}
        {!overviewPhoto ? (
            <>
                <Camera
                    ref={camera}
                    zoom={zoom}
                    type={cameraType}
                    flashMode={flashMode}
                    pictureSize="1:1"
                    onCameraReady={changeCameraReady}
                    style={{ flex: 1 }}
                >
                    <CloseButton onPress={() => navigation.navigate("Tabs")}>
                        <Ionicons name="chevron-back" color="#fafafa" size={32} />
                    </CloseButton>
                    <NextButton onPress={nextStep}>
                        <NextButtonText>Next</NextButtonText>
                    </NextButton>
                </Camera>
                <ContainerImg>
                    <Images horizontal={true} showHorizontalScrollIndicator={false}>
                        {photos.map((value, index) => (
                            <PhotoBox key={index} onPress={() => seeOverviewPhoto(index)}>
                                <PhotoImage source={{ uri: value }} />
                                <RemovePhotoBtn onPress={() => removePhoto(index)}>
                                    <Ionicons name="trash-bin" color="#ff471a" size={18} />
                                </RemovePhotoBtn>
                            </PhotoBox>
                        ))}
                    </Images>
                </ContainerImg>
            </>
        ) : (
            <Image resizeMode="cover" source={{ uri: overviewPhoto }} style={{ flex: 1 }} />
        )}
        <Actions>
            {!overviewPhoto ? (
                <>
                    <SliderContainer>
                        <Slider
                            style={{ width: 220, height: 400 }}
                            minimumValue={0}
                            maximumValue={0.4}
                            thumbTintColor={light ? "#404040" : "#efefef"}
                            minimumTrackTintColor="rgba(130, 130, 130, 0.5)"
                            maximumTrackTintColor="rgba(150, 150, 150, 0.5)"
                            onValueChange={changeZoom}
                        />
                    </SliderContainer>
                    <ButtonsContainer>
                        <ActionsContainer>
                            <TouchableOpacity onPress={changeFlashMode}>
                                <Ionicons name={flashMode === Camera.Constants.FlashMode.off ? "flash-off" : "flash"} color={light ? "#202020" : "#fafafa"} size={26} />
                            </TouchableOpacity>
                        </ActionsContainer>
                        <TakePhotoBtn onPress={takePhoto}>
                            {!cameraReady ? (
                                <ActivityIndicator color={light ? "#808080" : "#fafafa"} size={28} />
                            ) : null}
                        </TakePhotoBtn>
                        <ActionsContainer>
                            <TouchableOpacity onPress={changeCameraType}>
                                <Ionicons name={cameraType === Camera.Constants.Type.front ? "camera-reverse" : "camera"} color={light ? "#202020" : "#fafafa"} size={26} />
                            </TouchableOpacity>
                        </ActionsContainer>
                    </ButtonsContainer>
                </>
            ) : (
                <ReturnOverviewBtn onPress={getOutOverviewPhoto}>
                    <ReturnOverviewText>Close Preview</ReturnOverviewText>
                </ReturnOverviewBtn>
            )}
        </Actions>
    </Container>;
};