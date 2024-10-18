import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import styles from './WelcomePageStyle';

export default function WelcomePage() {
  const navigation = useNavigation(); // Access the navigation prop

  return (
    <View style={styles.container}>
      {/* Wrap the Image inside TouchableOpacity */}
      <TouchableOpacity
        onPress={() => navigation.navigate('MapToggle')} // Navigate to MapToggle.js
      >
        <Image 
          source={require('./assets/bitez.png')} // Adjust the path based on your project structure
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}
