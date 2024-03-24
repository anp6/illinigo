import { View, Text, Button, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'expo-camera';
import { StyleSheet } from 'react-native';


export default function Home({ navigation }) {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [count, setCount] = useState(0)

  const onCameraReady = () => {
    setIsCameraReady(true);
     };
   

  useEffect(() => {
    (async () => {
        const cameraPermission = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraPermission.status == 'granted');
    })();
  }, [])

  let takePic = async () => {
    if (cameraRef.current) {
    let options = {
        quality: 1,
        base64: true,
        exif: false
    }

    await cameraRef.current.takePictureAsync(options).then(newPhoto => 
      {setPhoto(newPhoto)
      });
    }
  }


  return (
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
        <View style={{ flex: 1 }}>
        <Camera ref={cameraRef } type={Camera.Constants.Type.back} onCameraReady={onCameraReady}>
            <View>
                <TouchableOpacity onPress={takePic}>
                    <Image source={require('../../assets/camera.png')} style={{ width: 50, height: 50 }} />
                </TouchableOpacity>
            </View>
          
           { photo ? <Image source={{ uri: photo.uri }} style={styles.image} />  : <View></View>}
        </Camera>
    </View>
      </View> 
  );

  
  }

  const styles = StyleSheet.create({
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
    itemContainer: {
      width: 150,
      margin: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      alignItems: 'center', 
      justifyContent: 'center',
    },
    image: {
      width: 100,
      height: 100,
    },
    url: {
      color: 'blue',
    },
  });