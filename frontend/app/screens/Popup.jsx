import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, Animated } from 'react-native';
import DATA from '../../database.json';

const Popup = ({ route }) => {
  const { image } = route.params;
  const pokemon = DATA.find(pokemon => pokemon.image === image);

  const [expandedWhite, setExpandedWhite] = useState(false);
  const [expandedGrey, setExpandedGrey] = useState(false);
  const [expandedPurple, setExpandedPurple] = useState(false);
  const [animationWhite] = useState(new Animated.Value(0));
  const [animationGrey] = useState(new Animated.Value(0));
  const [animationPurple] = useState(new Animated.Value(0));

  const handleWhitePress = () => {
    setExpandedWhite(!expandedWhite);
    Animated.timing(animationWhite, {
      toValue: expandedWhite ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleGreyPress = () => {
    setExpandedGrey(!expandedGrey);
    Animated.timing(animationGrey, {
      toValue: expandedGrey ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handlePurplePress = () => {
    setExpandedPurple(!expandedPurple);
    Animated.timing(animationPurple, {
      toValue: expandedPurple ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const rectangleHeightWhite = animationWhite.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 200], 
  });

  const rectangleHeightGrey = animationGrey.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 200], 
  });

  const rectangleHeightPurple = animationPurple.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 200], 
  });

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.text}>{pokemon ? pokemon.name : 'Unknown Pokémon'}</Text>
      <TouchableWithoutFeedback onPress={handleGreyPress}>
        <Animated.View style={[styles.rectangleBehind, { height: rectangleHeightGrey, zIndex: 2 }]}>
        <Text style={[styles.rectangleText, styles.title]}>Stats</Text>
      </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={handlePurplePress}>
        <Animated.View style={[styles.rectanglePurple, { height: rectangleHeightPurple, zIndex: 1 }]}>
          <Text style={[styles.rectangleText, styles.title]}>Info</Text>
          {expandedPurple && 
            <View style={styles.expandedContent}>
            </View>
          }
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={handleWhitePress}>
        <Animated.View style={[styles.rectangle, { height: rectangleHeightWhite, zIndex: 3 }]}>
          <Text style={[styles.rectangleText, styles.title]}>My Snaps</Text>
          {expandedWhite && 
            <View style={styles.expandedContent}>
              <Image source={{ uri: image }} style={styles.image} />
            </View>
          }
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4C279',
    paddingBottom: 350,
  },
  image: {
    width: 150,
    height: 150,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rectangle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingTop: 10, 
    borderRadius: 20, 
    overflow: 'hidden', 
  },
  rectangleBehind: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'grey', 
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingTop: 90, 
    borderRadius: 20, 
    overflow: 'hidden',
  },
  rectanglePurple: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2457CD', 
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingTop: 140, 
    borderRadius: 20, 
    overflow: 'hidden',
  },
  rectangleText: {
    color: 'black',
    fontSize: 16,
    paddingTop: 10,
  },
  title: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  expandedContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
});

export default Popup;
