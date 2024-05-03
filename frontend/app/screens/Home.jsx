import React, {useState, useEffect, useRef} from "react";
import { StyleSheet, Text, View, Image, Alert } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import Button from "../../components/Button";
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import axios from "axios";
import { Buffer } from 'buffer';
// geolocation
import * as Location from 'expo-location';



export default function Home({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [character, setCharacter] = useState({image: null, id: null});
  const cameraRef = useRef(null);
  const locationSubscription = useRef(null);
  const ws = useRef(null);  const uid = FIREBASE_AUTH.currentUser.uid;
  const images = {
    grain: require('../../assets/222_img.png'),
    pikachu: require('../../assets/pikachu.png'),
    schrodinger: require('../../assets/schrodinger.png')
    // Add other images similarly
  };


  useEffect(() => {
    (async function initialize() {
      //MediaLibrary.requestPermissionsAsync();
      const cameraPerm = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPerm.status === 'granted');

      // Request location permission
      const locationPerm = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationPerm.status === 'granted');


      if ( cameraPerm.status !== 'granted' || locationPerm.status !== 'granted') {
          Alert.alert("Permissions required", "Camera and Location permissions are needed to use this app");
      }
      setupWebSocket();
      function setupWebSocket() {
        ws.current = new WebSocket('ws://0.tcp.ngrok.io:11040'); // replace url with your ngrok url
        ws.current.onopen = () => {
          console.log('WebSocket connected');
          startLocationUpdates();
        };
        ws.current.onmessage = (event) => handleCritter(JSON.parse(event.data));
        ws.current.onerror = (error) => console.error(`WebSocket error: ${error.message}`);
        ws.current.onclose = () => {
          console.log('WebSocket disconnected');
          // Try to reconnect every 5 seconds
          setTimeout(setupWebSocket, 5000);
        };
      }
      function startLocationUpdates() {
        // Set up the watcher with specific time and distance constraints
        locationSubscription.current = Location.watchPositionAsync({
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // updates every 5 seconds
          distanceInterval: 5, // or every 5 meters
        }, (newLocation) => {
            
            console.log(newLocation);
            //setLocation(newLocation);
            if (ws.current && ws.current.readyState === WebSocket.OPEN && newLocation && newLocation.coords) {
              ws.current.send(JSON.stringify({
                longitude: newLocation.coords.longitude,
                latitude: newLocation.coords.latitude
              }));
            } else {
              console.log("Location data is not currently available.");

            }
          }).then(subscription => {
              locationSubscription.current = subscription; // Storing subscription to manage it later
          }).catch(error => {
              console.error("Failed to start location updates: ", error);
              Alert.alert("Location Error", "Failed to start location updates.");
          });
      }
        
    })();

    return () => {
        if (locationSubscription.current) {
            locationSubscription.current.remove();
        }
        if (ws.current) {
          ws.current.close();
        }
    };
    
       
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

  const handleCritter = (data) => {
    // critter spawn logic (AR goes here!)
    console.log(data);
    if (Object.keys(data).length > 0 && data.name) {
      // despawn all critters (currently only one can spawn at a time)
      // spawn the the critter returned by the backend
      setCharacter({image: data.image, id: data.id});
      console.log(`Critter ${data.name} has spawned!`);
    } else if (Object.keys(data).length === 0) {
      // there are no critters in range now, despawn everything
      setCharacter({image: null, id: null});
      console.log('There are no critters in spawn range');
    } else {
      // error, something went wrong in the backend 
      console.log('Something went wrong while finding critters!');
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.9,
                base64: true
            });

            if (photo && character.id != null) {
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
                handleUserUpdate(character.id, base64Image);
            }
        } catch (e) {
            console.error('Error taking picture and processing:', e);
        }
    }
};


  if (hasCameraPermission === false) {
    return <Text>No Access to Camera</Text>
  }

  if (!hasLocationPermission) {
    return <Text>No Access to Location</Text>
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef} type={CameraType.back}>
        {character.image !== null ? <Image
              source={require(character.image)} // Adjust the path to where your image is stored
              style={styles.overlayImage}
          /> : <View></View>}
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