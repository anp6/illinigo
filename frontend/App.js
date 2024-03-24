import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './app/screens/Login';
import Home from './app/screens/Home';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import Profile from './app/screens/Profile';
import { TouchableOpacity } from 'react-native';

const Tab = createBottomTabNavigator();

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 10, backgroundColor: 'black' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isProfile = label.toLowerCase().includes('profile');
        const isHome = label.toLowerCase().includes('home')

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
        }

        return (
          <TouchableOpacity
            key={label}
            onPress={onPress}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {isProfile ? (
              <Icon name={iconName} type="font-awesome" size={24} color={isFocused ? 'tomato' : 'gray'} />
            ) : (
              <Icon name={iconName} type="font-awesome" size={24} color={isFocused ? 'tomato' : 'gray'} />
            )}
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
      <Tab.Screen name="Profile" component={Profile} />
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
    })
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