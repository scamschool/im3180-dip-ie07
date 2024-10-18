import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './LocationStyle';
import ssImage from './assets/ss.png';
import quadImage from './assets/quad.png';

export default function Location({ navigation }) {
  const [canteens, setCanteens] = useState([
    {
      id: '1',
      name: 'Canteen B - South Spine',
      description: 'Fine Food @ South Spine, 50 Nanyang Avenue, SS3-B4, Singapore 639798',
      image: ssImage,
      openingTime: '0730',  // 7:30 AM
      closingTime: '1930',  // 7:30 PM
    },
    {
      id: '2',
      name: 'Quad Cafe - SBS',
      description: '60 Nanyang Drive, The Quad Cafe, School of Biological Sciences, Level B1, 637551',
      image: quadImage,
      openingTime: '0730',  // 7:30 AM
      closingTime: '2100',  // 9:00 PM
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const isOpenNow = (openingTime, closingTime) => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = currentHours * 100 + currentMinutes;

    return currentTime >= parseInt(openingTime) && currentTime <= parseInt(closingTime);
  };

  const filteredCanteens = canteens.map((canteen) => ({
    ...canteen,
    isOpen: isOpenNow(canteen.openingTime, canteen.closingTime),
  }));

  const handleNavigation = (canteenId) => {
    if (canteenId === '1') {
      navigation.navigate('PopUpSS'); // Navigate to PopUpSS.js for Canteen B
    } else if (canteenId === '2') {
      navigation.navigate('PopUpQuad'); // Navigate to PopUpQuad.js for Quad Cafe
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section with Back Button */}
      <View style={styles.header}>
        <Text style={styles.title}>Location</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MapToggle')}>
          <Icon name="swap-vert" size={24} color="#fff" />
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
          <TouchableOpacity onPress={() => handleNavigation(item.id)}>
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
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.canteenList}
      />
    </View>
  );
}
