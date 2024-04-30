import React, {useState, useEffect, useRef} from "react";
import { StyleSheet, Text, View, Image, Alert } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import Button from "../../components/Button";
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import axios from "axios";
import { Buffer } from 'buffer';


export default function Home({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null)
  const [image, setImage] = useState(null);
  const [character, setCharacter] = useState("662ff0246a744b16e07e91dc");
  const cameraRef = useRef(null);
  const uid = FIREBASE_AUTH.currentUser.uid;


  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      console.log(cameraStatus)
      setHasCameraPermission(cameraStatus.granted)
    })();
  }, [])

  const uploadImage = async (imageUri) => {
    const fileName = `uploads/${new Date().toISOString()}.png`;
    const response = await fetch(`https://illinigodeployed-1.onrender.com/generate-signed-url?fileName=${fileName}`);
    const { url } = await response.json();
  
    const blob = await fetch(imageUri).then(res => res.blob());
  
    const uploadResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: blob,
    });
  
    if (uploadResponse.ok) {
      console.log('Upload successful');
      return "https://storage.googleapis.com/illinigo/" + fileName;
    } else {
      console.error('Upload failed');
    }
  };

  const handleUserUpdate = async ( critterId, imageUri ) => {
    try {
      const response = await axios.get(`https://illinigodeployed-1.onrender.com/user/${uid}`);
      const userData = response.data;
      if (!userData.found.includes(critterId)) {
        const updatedCritterIds = [...userData.found, critterId];
        console.log(updatedCritterIds);
        const updateResponse = await axios.put(`https://illinigodeployed-1.onrender.com/user/${uid}/update`, { found: updatedCritterIds });
  
        console.log('Update Response:', updateResponse.data);
      } else {
        console.log('CritterId already exists in the user data.');
      }
      Alert.alert(
        "Upload Picture",
        "Would you like to save the picture?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Picture upload cancelled."),
            style: "cancel"
          },
          { 
            text: "OK", 
            onPress: async () => {
              const imageUrl = await uploadImage(imageUri);
              if (imageUrl) {
                console.log(`Image uploaded successfully: ${imageUrl}`);
                const pictures = userData.pictures || [];
                if (userData.found.includes(critterId)) {
                  const index = userData.found.indexOf(critterId);
                  pictures[index] = imageUrl;
                } else {
                  userData.found.push(critterId);
                  pictures.push(imageUrl);
                }
                const updateResponse = await axios.put(`https://illinigodeployed-1.onrender.com/user/${uid}/updateImage`, { pictures });
                console.log('Update Response:', updateResponse.data);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error handling user update:', error);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.9,
                base64: true
            });

            if (photo && character != null) {
                const formData = new FormData();
                formData.append('baseImage', {
                    uri: photo.uri,
                    type: 'image/jpeg',
                    name: 'photo.jpg',
                });

                const response = await axios.post('https://illinigodeployed-1.onrender.com/composite-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    responseType: 'arraybuffer',
                });
                const base64Image = `data:image/png;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
                console.log(base64Image)
                handleUserUpdate(character, base64Image);
            }
        } catch (e) {
            console.error('Error taking picture and processing:', e);
        }
    }
};


  if (hasCameraPermission === false) {
    return <Text>No Access to Camera</Text>
  }


  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef} type={CameraType.back}>
          <Image
              source={require('../../assets/222_img.png')} // Adjust the path to where your image is stored
              style={styles.overlayImage}
          />
          <View style={styles.buttonContainer}>
              <Button title={'Take a Picture'} onPress={takePicture} />
          </View>
      </Camera>
  </View>
  );

  
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#000',
      alignItems: 'center',
      justifyContent: 'center',
  },
  camera: {
      flex: 1,
      width: '100%',
      justifyContent: 'flex-end',
  },
  buttonContainer: {
      flex: 0,
      alignSelf: 'center', 
      alignItems: 'center',
      marginBottom: 20,
  },
  buttonText: {
      fontSize: 20,
  },
  overlayImage: {
    width: 100, // Set the width of the image
    height: 100, // Set the height of the image
    position: 'absolute', // This positions the image absolutely within its parent
    top: 400, // Adjust spacing from the top
    alignSelf: 'center', // Centers horizontally
},
});