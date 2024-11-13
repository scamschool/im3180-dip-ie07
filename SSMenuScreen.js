import React, { useState, useCallback, useEffect, useContext} from 'react';
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, TextInput, Image, Modal } from 'react-native';
import { styles, chartConfig } from './style';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For back icon and search icon
import { Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar'
import { SoundContext } from './SoundContext'; 
import { useTheme } from './ThemeContext';
import { createStyles, createChartConfig } from './style'; 

//Category Item Images
import allImage from './assets/all.png';
import vegetarianImage from './assets/vegetarian.png';
import halalImage from './assets/halal.png';
import beveragesImage from './assets/beverages.png';
import chickenRiceImage from './assets/chicken_rice.jpg'; 

//Menu Items Images
import beverageImage from './assets/beverage.jpg';
import braised_duck_riceImage from './assets/braised_duck_rice.jpg';
import chicha_san_chenImage from './assets/chicha_san_chen.jpg';
import dim_sumImage from './assets/dim_sum.jpg';
import fruits_juicesImage from './assets/fruits_juices.jpg';
import hot_pot_snail_rice_noodleImage from './assets/hot_pot_snail_rice_noodle.jpg';
import japanese_koreanImage from './assets/japanese_korean.jpg';
import mala_hotpotImage from './assets/mala_hotpot.jpg';
import pasta_fried_riceImage from './assets/pasta_fried_rice.jpg';
import taiwan_cuisineImage from './assets/taiwan_cuisine.jpg';
import xiao_long_baoImage from './assets/xiao_long_bao.jpg';
import yong_tau_fooImage from './assets/yong_tau_foo.jpg';
import steamed_rice_soupImage from './assets/steamed_rice_soup.jpg';
import mixed_veg_riceImage from './assets/mixed_veg_rice.jpg';



// Main component for the South Spine Canteen menu screen
const SSMenuScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const chartConfig = createChartConfig(theme);
  const { playSound1, playSound2 } = useContext(SoundContext);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  // Categories for filtering menu items, each with a name and an associated image
  const categories = [
    { name: 'All', image: allImage },
    { name: 'Vegetarian', image: vegetarianImage },
    { name: 'Halal', image: halalImage },
    { name: 'Beverages', image: beveragesImage }
  ];

  // Menu items grouped by category
  const menuItemsByCategory = {
    All: ['Mala Hotpot', 'Braised Duck Rice', 'Yong Tau Foo', 'Taiwan Cuisine', 'Pasta & Fried Rice', 
      'Hot Pot Snail Rice Noodle', 'Japanese & Korean', 'Mixed Veg Rice', 'Steamed Rice & Soup', 
      'Xiao Long Bao', 'Dim Sum', 'Fruits and Juices', 'Beverages', 'Chicha San Chen'],
    Vegetarian: ['Mala Hotpot','Yong Tau Foo', 'Pasta & Fried Rice'],
    Halal: ['Yong Tau Foo'],
    Beverages: ['Fruits and Juices', 'Beverages', 'Chicha San Chen']
  };

  const menuItemImages = {
    'Mala Hotpot': mala_hotpotImage, 
    'Braised Duck Rice': braised_duck_riceImage, 
    'Yong Tau Foo': yong_tau_fooImage, 
    'Taiwan Cuisine': taiwan_cuisineImage, 
    'Pasta & Fried Rice':pasta_fried_riceImage, 
    'Hot Pot Snail Rice Noodle':hot_pot_snail_rice_noodleImage, 
    'Japanese & Korean': japanese_koreanImage, 
    'Mixed Veg Rice': mixed_veg_riceImage, 
    'Steamed Rice & Soup': steamed_rice_soupImage, 
    'Xiao Long Bao': xiao_long_baoImage, 
    'Dim Sum': dim_sumImage, 
    'Fruits and Juices': fruits_juicesImage, 
    'Beverages': beverageImage, 
    'Chicha San Chen': chicha_san_chenImage,
  };

  // Filter menu items based on the selected category and search query
  const filteredItems = menuItemsByCategory[selectedCategory].filter(item =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMenuItemClick = (item) => {
    setSelectedMenuItem(item);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style = {styles.safeArea}>
      <StatusBar style={theme.background === '#1C3461' ? 'light' : 'dark'} />
      <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
                  onPress={() => {
                      playSound2(); // Play the sound
                      navigation.goBack(); // Navigate back
                  }}
              >
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Menu</Text>
        <View style={styles.placeholderIcon}></View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#aaa" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Buttons with Images */}
      <View style={styles.categoriesContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.categoryButton,
              selectedCategory === category.name && styles.selectedCategoryButton
            ]}
            onPress={() => {
              playSound1(); // Play the sound
              setSelectedCategory(category.name); // Set the selected category
          }}
          >
            <Image source={category.image} style={styles.categoryImage} />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.name && styles.selectedCategoryText
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Menu Items */}
      <ScrollView contentContainerStyle={styles.menuContainer}>
          {filteredItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={() => {
              playSound1(); // Play the sound
              handleMenuItemClick(item); // Call the handleMenuItemClick function with the item
          }}>
              <Text style={styles.menuItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

          {/* Modal for displaying item image */}
      <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{selectedMenuItem}</Text>
              {menuItemImages[selectedMenuItem] && (
                <Image source={menuItemImages[selectedMenuItem]} style={styles.modalImage} />
              )}
              <TouchableOpacity style={styles.closeButton} onPress={() => {
                    playSound2(); // Play the sound
                    setModalVisible(false); // Call the handleMenuItemClick function with the item
                }}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View> 
          </View>
        </Modal>

    </View>
    </SafeAreaView>
  );
};

export default SSMenuScreen;
