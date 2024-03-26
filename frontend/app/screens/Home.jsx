import React, {useState, useEffect, useRef} from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import Button from "../../components/Button";


export default function Home({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null)
  const [image, setImage] = useState(null);
  const cameraRef = useRef(null);


  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      console.log(cameraStatus)
      setHasCameraPermission(cameraStatus.granted)
    })();
  }, [])

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch(e) {
        console.log(e)
      }
    }
  }

  if (hasCameraPermission === false) {
    return <Text>No Access to Camera</Text>
  }


  return (
       <View style={styles.container}>
        {!image ? 
        <View>
        <Camera 
        style={styles.camera}
        ref={cameraRef}
        >
          </Camera>
        
          <View>
            <Button title={'Take a Picture'} icon="camera" onPress={takePicture}></Button>
          </View>
          </View> : 
          <View>
            <Image source={{uri: image}} style={styles.camera}></Image>
            <View>
            <Button title={'Save Picture'} icon="camera" onPress={takePicture}></Button>
          </View>
          </View>
        }
      </View> 
  );

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 15,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  whiteText: {
    color: '#fff', // This sets the text color to white
  },
})