import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Image, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import axios from 'axios'; 
import Popup from './Popup';  

const uid2 = 'SqFQqBCJG2QBIV08c6XNS4AiQmm2';

const Item = ({ item, onPress, foundItems }) => {
  const isFound = foundItems.includes(item._id);
  const uid = FIREBASE_AUTH.currentUser.uid;

  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View style={[styles.item, isFound && styles.foundItem]}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>
    </TouchableOpacity>
  );
};

const Catalog = ({ navigation }) => {
  const [characters, setCharacters] = useState([]);
  const [foundItems, setFoundItems] = useState([]);

  useEffect(() => {
    fetchCharacters();
    fetchMyCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await axios.get('https://illinigodeployed.onrender.com/api/characters'); 
      setCharacters(response.data);
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  };

  const fetchMyCharacters = async() => {
    try {
      const response = await axios.get(`https://illinigodeployed-1.onrender.com/user/${uid2}`); 
      setFoundItems(response.data.found);
    } catch (error) {
      console.error('Error fetching my characters:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.catalogTitle}>Catalog</Text>
        <Text style={styles.foundText}>Found: {foundItems.length}/2</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search for a critter"
          style={styles.searchInput}
        />
      </View>
      <FlatList
        data={characters}
        renderItem={({ item }) => (
          <Item item={item} onPress={(item) => navigation.navigate('Popup', { item })} foundItems={foundItems} />
        )}
        keyExtractor={(item) => item._id}
        numColumns={3}
        style={{ marginTop: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center'
  },
  headerContainer: {
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  catalogTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  foundText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  searchContainer: {
    padding: 10,
    width: 300
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    padding: 10,
  },
  item: {
    backgroundColor: '#DBDBDB',
    padding: 20,
    margin: 8,
    borderRadius: 20,
  },
  foundItem: {
    backgroundColor: 'green',
  },
  image: {
    width: 75,
    height: 75,
  },
});

const Stack = createStackNavigator();

const CatalogStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Catalog" component={Catalog} />
      <Stack.Screen name="Popup" component={Popup} />
    </Stack.Navigator>
  );
};

export default CatalogStack;
