import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './app/screens/Login';
import Home from './app/screens/Home';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from './FirebaseConfig';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import Catalog from './app/screens/Catalog';
import Profile from './app/screens/Profile';
import { TouchableOpacity } from 'react-native';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID
} from '@env';

const Tab = createBottomTabNavigator();

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 10, paddingTop: 10, backgroundColor: 'black' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;


        const isCatalog = label.toLowerCase().includes('catalog');
        const isProfile = label.toLowerCase().includes('profile');
        const isHome = label.toLowerCase().includes('home');

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const isFocused = state.index === index;

        let iconName;
        if (isProfile) {
          iconName = 'user-circle';
        } else if (isHome) {
          iconName = 'home';
        } else if (isCatalog) {
          iconName = 'rocket'
        }

        return (
          <TouchableOpacity
            key={label}
            onPress={onPress}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={iconName} type="font-awesome" size={24} color={isFocused ? '#e76011' : 'gray'} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}



const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Catalog" component={Catalog} />
      <Tab.Screen name="Profile" component={Profile}/>
      {/* Add more Tab.Screen components as needed */}
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    }),
    console.log(FIREBASE_API_KEY, "HELLO WROLD");
  }, [])
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (<Stack.Screen name='Inside' component={InsideLayout} options={{headerShown: false}} />) : (
          <Stack.Screen name='Login' component={Login} options={{headerShown: false}} />
        )}
  
      </Stack.Navigator>
    </NavigationContainer>
  );
}