import React, {useState, useEffect, useRef} from "react";
import { StyleSheet, Text, View } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from 'expo-media-library';


export default function Home({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null)
  const [image, setImage] = useState(null);
  const cameraRef = useRef(null);


  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus == 'granted')
    })();
  }, [])


  return (
       <View style={styles.container}>
        <Camera 
        style={styles.camera}
        ref={cameraRef}
        >
          <Text style={styles.whiteText}>PURDUE</Text>
          </Camera>
      </View> 
  );

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  whiteText: {
    color: '#fff', // This sets the text color to white
  },
})