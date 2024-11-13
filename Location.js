import React, { useState, useCallback, useEffect, useContext} from 'react';
import { SafeAreaView, View, Text, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ssImage from './assets/ss.png';
import quadImage from './assets/quad.png';
import { SoundContext } from './SoundContext'; // Update this line
import { useTheme } from './ThemeContext';
import { createStyles, chartConfig } from './style';

// Main Location component
export default function Location({ navigation, route }) {
  const theme = useTheme();
    const styles = createStyles(theme);
  const { playSound1, playSound2 } = useContext(SoundContext);

  // Retrieve time estimates passed through navigation parameters, default to "0 min" if not provided
  const { timeEstimateQuad = "0 min", timeEstimateCanteenB = "0 min" } = route.params || {};

  // Refresh the current page by reloading the component
  const handleRefresh = () => {
    navigation.replace('Location'); // Refresh the current page
  };

  // Initial state for the list of canteens with details for each canteen id  
  const [canteens, setCanteens] = useState([
    {
      id: '1',
      name: 'Quad Canteen - SBS',
      description: '60 Nanyang Drive, The Quad Cafe, School of Biological Sciences, Level B1, 637551',
      image: quadImage,
      openingTime: '0730',  // 7:30 AM
      closingTime: '2100',  // 9:00 PM
      timeEstimate: timeEstimateQuad, // Use Quad Cafe time estimate
      
    },
    {
      id: '2',
      name: 'Canteen B - South Spine',
      description: 'Fine Food @ South Spine, 50 Nanyang Avenue, SS3-B4, Singapore 639798',
      image: ssImage,
      openingTime: '0730',  // 7:30 AM
      closingTime: '2100',  // 9:00 PM
      timeEstimate: timeEstimateCanteenB, // Use Canteen B time estimate
    },
  ]);

  // State to store search term input for filtering canteens
  const [searchTerm, setSearchTerm] = useState('');

  // Helper function to determine if a canteen is open based on the current time
  const isOpenNow = (openingTime, closingTime) => {
    const now = new Date();
    
    // Extract opening and closing hours and minutes
    const openingHours = parseInt(openingTime.substring(0, 2), 10);
    const openingMinutes = parseInt(openingTime.substring(2), 10);
    const closingHours = parseInt(closingTime.substring(0, 2), 10);
    const closingMinutes = parseInt(closingTime.substring(2), 10);
    
    // Create date objects for opening and closing times
    const openingDate = new Date();
    openingDate.setHours(openingHours, openingMinutes, 0);
  
    const closingDate = new Date();
    closingDate.setHours(closingHours, closingMinutes, 0);
  
    // Check if the current time falls between opening and closing times
    return now >= openingDate && now <= closingDate;
  };
  
  // Map through canteens, adding an isOpen property to indicate if they're currently open
  const filteredCanteens = canteens.map((canteen) => ({
    ...canteen,
    isOpen: isOpenNow(canteen.openingTime, canteen.closingTime),
  }));

  // Handle navigation to specific pop-up screens based on canteen ID
  const handleNavigation = (canteenId) => {
    if (canteenId === '1') {
      navigation.navigate('PopUpSS'); // Navigate to PopUpSS.js for Canteen B
    } else if (canteenId === '2') {
      navigation.navigate('PopUpQuad'); // Navigate to PopUpQuad.js for Quad Cafe
    }
  };

  return (
    <SafeAreaView style = {styles.safeArea}>
      <StatusBar style={theme.background === '#1C3461' ? 'light' : 'dark'} />
      <View style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity onPress={() => {
            playSound2(); // Play the sound
            handleRefresh(); // Call the handleRefresh function
        }}>
          <Icon name="refresh" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Location</Text>
        <TouchableOpacity onPress={() => {
            playSound1(); // Play the sound
            navigation.navigate('MapToggle'); 
        }}>
          <Icon name="swap-vert" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#000" style={styles.icon} />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* Canteen List */}
      <FlatList
        data={filteredCanteens.filter((canteen) =>
          canteen.name.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {
                playSound1(); // Play the sound
                handleNavigation(item.id); // Call the handleNavigation function with the item ID
            }}>
            <View style={styles.card}>
              <Image source={item.image} style={styles.image} />
              <View style={styles.infoContainer}>
                <Text style={styles.titleText}>{item.name}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <View style={styles.statusContainer}>
                  <Text style={styles.statusText}>
                    {item.isOpen ? 'Open' : 'Closed'}
                  </Text>
                  <View
                    style={[
                      styles.statusIndicator,
                      { backgroundColor: item.isOpen ? '#00FF00' : '#FF0000' }, // Green if open, red if closed
                    ]}
                  />
                    {/* Clock Icon with Time Text */}
                    <View style={styles.clockContainer}>
                      <Icon name="access-time" size={16} color="#555" />
                      <Text style={styles.timeText}>{item.timeEstimate}</Text>
                    </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.canteenList}
      />
    </View>
    </SafeAreaView>
  );
}
