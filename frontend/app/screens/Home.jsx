import React, {useState, useEffect, useRef} from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import Button from "../../components/Button";
// geolocation
import * as Location from 'expo-location';



export default function Home({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);
  const cameraRef = useRef(null);
  const locationSubscription = useRef(null);
  const ws = useRef(null);

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
        ws.current = new WebSocket('ws://0.tcp.ngrok.io:14495'); // replace url with your ngrok url
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

  const handleCritter = (data) => {
    // critter spawn logic (AR goes here!)
    console.log(data);
    if (Object.keys(data).length > 0 && data.name) {
      // despawn all critters (currently only one can spawn at a time)
      // spawn the the critter returned by the backend
      console.log(`Critter ${data.name} has spawned!`);
    } else if (Object.keys(data).length === 0) {
      // there are no critters in range now, despawn everything
      console.log('There are no critters in spawn range');
    } else {
      // error, something went wrong in the backend 
      console.log('Something went wrong while finding critters!');
    }
  };

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

  if (!hasLocationPermission) {
    return <Text>No Access to Location</Text>
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
