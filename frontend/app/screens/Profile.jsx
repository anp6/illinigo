import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView  } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import {
  FIREBASE_URL
} from '@env';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState('https://via.placeholder.com/150');
  const level = 5;
  const experience = 900;
  const followerCount = 100;
  const sprites = 50;
  const following = 30;
  const uid = FIREBASE_AUTH.currentUser.uid;
  const [activeSection, setActiveSection] = useState('stats');
  const badges = Array.from({ length: 8 }, (_, index) => ({
    id: index,
    imageUrl: `https://via.placeholder.com/70?text=Badge${index + 1}`
  }));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://illinigodeployed-1.onrender.com/user/${uid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUsername(userData.username);
        if (userData.pfp != "") {
            setProfilePic(userData.pfp);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [uid]); 

  const renderPersonalInfoSection = () => (
    <View>
      <View style={styles.blueBox}>
        <View style={styles.personalInfoBox}>
          <Text style={styles.personalInfoLabel}>First Name:</Text>
          <Text style={styles.personalInfoValue}>John</Text>
        </View>
        <View style={styles.personalInfoBox}>
          <Text style={styles.personalInfoLabel}>Last Name:</Text>
          <Text style={styles.personalInfoValue}>Doe</Text>
        </View>
        <View style={styles.personalInfoBox}>
          <Text style={styles.personalInfoLabel}>Email:</Text>
          <Text style={styles.personalInfoValue}>johndoe@example.com</Text>
        </View>
        <View style={styles.personalInfoBox}>
          <Text style={styles.personalInfoLabel}>Password:</Text>
          <Text style={styles.personalInfoValue}>********</Text>
        </View>
      </View>
    </View>
  );

  const renderStatsSection = () => (
    <View>
      <View style={styles.statsContainer}>
        <View style={styles.rowContainer}>
          <View style={styles.itemContainer}>
            <Text style={styles.rowItemNumber}>{followerCount}</Text>
            <Text style={styles.rowItemText}>Followers</Text>
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.rowItemNumber}>{sprites}</Text>
            <Text style={styles.rowItemText}>Sprites</Text>
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.rowItemNumber}>{following}</Text>
            <Text style={styles.rowItemText}>Following</Text>
          </View>
        </View>
        <View style={styles.shadowContainer}>
          <Text style={styles.levelText}>Level: {level}</Text>
          <View style={styles.xpBar}>
            <View style={[styles.xpProgress, { width: `${(experience / 1000) * 100}%` }]} />
          </View>
          <Text style={styles.xpText}>{experience}/1000 XP</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.pageContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.blueBox}>
            <Image
              source={{ uri: profilePic }}
              style={styles.profilePic}
            />
            <Text style={styles.username}>{username}</Text>
          </View>
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => setActiveSection('stats')} style={[styles.navItem, activeSection === 'stats' && styles.activeNavItem]}>
              <Text style={styles.navText}>Stats</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveSection('personalInfo')} style={[styles.navItem, activeSection === 'personalInfo' && styles.activeNavItem]}>
              <Text style={styles.navText}>Personal Info</Text>
            </TouchableOpacity>
          </View>
          {activeSection === 'stats' ? renderStatsSection() : null}
          {activeSection === 'personalInfo' ? renderPersonalInfoSection() : null}
          <TouchableOpacity onPress={() => FIREBASE_AUTH.signOut()} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );


  // return (
  //   <View style={styles.container}>
  //     <Image
  //       source={{ uri: profilePic }}
  //       style={styles.profilePic}
  //     />
  //     <Text style={styles.username}>{username}</Text>
  //     <TouchableOpacity onPress={() => FIREBASE_AUTH.signOut()} style={styles.logoutButton}>
  //       <Text style={styles.logoutButtonText}>Logout</Text>
  //     </TouchableOpacity>
  //   </View>
  // );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     backgroundColor: '#f7f7f7',
//     paddingTop: 60,
//   },
//   profilePic: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     marginBottom: 16,
//   },
//   username: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 24,
//   },
//   logoutButton: {
//     backgroundColor: '#e76011',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 5,
//   },
//   logoutButtonText: {
//     color: 'white',
//     fontSize: 18,
//   },
// });

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 2,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 30,
  },
  profilePic: {
    width: 130,
    height: 130,
    borderRadius: 75,
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  spaceRow: {
    height: 20, 
  },
  blueBox: {
    backgroundColor: '#65b8f7',
    borderRadius: 10, 
    padding: 10, 
    paddingTop: 30,
    marginBottom: 20,
    paddingLeft: 18,
    width: '80%',
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeNavItem: {
    backgroundColor:  '#65b8f7',
    borderBottomColor: 'blue',
  },
  navText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  itemContainer: {
    alignItems: 'center',
    marginRight: 20, 
  },
  rowItemText: {
    fontSize: 16,
    textAlign: 'center', 
  },
  rowItemNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center', 
  },
  pastelOrangeBox: {
    backgroundColor: '#FFCC99',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  xpBar: {
    width: 200,
    height: 20,
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  xpProgress: {
    height: 20,
    backgroundColor: '#00b300',
    borderRadius: 10,
  },
  xpText: {
    fontSize: 16,
    marginTop: 8,
  },
  achievementsContainer: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  awardBox: {
    alignItems: 'center',
    marginRight: 20,
    marginTop: 10,
  },
  awardText: {
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },
  awardImage: {
    width: 70,
    height: 70,
    borderRadius: 5,
  },
  blankSection: {
    height: 300, 
  },
  logoutButton: {
    backgroundColor: '#FFCC99',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'black',
    fontSize: 18,
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  shadowContainer: {
    backgroundColor: '#FFCC99',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginBottom: 10,
  },
  personalInfoBox: {
    backgroundColor: '#65b8f7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  personalInfoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  personalInfoValue: {
    fontSize: 16,
  },

});

export default Profile;