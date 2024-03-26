import React from 'react';
import { StyleSheet, View, TextInput, FlatList, Image, Text, SafeAreaView  } from 'react-native';
import DATA from '../../database.json'


const Item = ({ image }) => (
  <View style={styles.item}>
    <Image source={{uri: image}} style={styles.image} />
  </View>
);

const Catalog = () => {
  const totalItems = DATA.length;
  const foundItems = DATA.filter(item => item.found).length;

  console.log(DATA)
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.catalogTitle}>Catalog</Text> 
        <Text style={styles.foundText}>Found: {foundItems}/{totalItems}</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search for a critter"
          style={styles.searchInput}
        />
      </View>
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Item image={item.image} />}
        keyExtractor={item => item.id}
        numColumns={3}
        style={{marginTop: 20}}
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
  image: {
    width: 75,
    height: 75,
  },
});

export default Catalog;