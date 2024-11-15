import React, { useState, useCallback, useEffect, useContext} from 'react';
import { SafeAreaView, useColorScheme, View, Text, ScrollView, TouchableOpacity, TextInput, Image, Modal } from 'react-native';
import { styles, chartConfig } from './style';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For back icon and search icon
import { Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SoundContext } from './SoundContext';
import { useTheme } from './ThemeContext';
import { createStyles, createChartConfig } from './style'; 

//Category Item Images
import allImage from './assets/all.png'; 
import vegetarianImage from './assets/vegetarian.png';
import halalImage from './assets/halal.png';
import beveragesImage from './assets/beverages.png';

//Menu Items Images
import drinksDessertImage from './assets/drinks_dessert.jpg';
import chicken_riceImage from './assets/chicken_rice.jpg';
import vietnam_foodImage from './assets/vietnam_food.jpg';
import mix_economic_riceImage from './assets/mix_economic_rice.jpg';
import chinese_foodImage from './assets/chinese_food.jpg';
import la_mian_mini_wokImage from './assets/la_mian_mini_wok.jpg';
import korean_foodImage from './assets/korean_food.jpg';
import fried_yong_tau_fooImage from './assets/fried_yong_tau_foo.jpg';

// Main component for the Quad Cafe menu screen
const QuadMenuScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const chartConfig = createChartConfig(theme);
  const { playSound1, playSound2 } = useContext(SoundContext);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  // Categories available, each with a name and an associated image
  const categories = [
    { name: 'All', image: allImage },
    { name: 'Vegetarian', image: vegetarianImage },
    { name: 'Halal', image: halalImage },
    { name: 'Beverages', image: beveragesImage }
  ];

  // Menu items grouped by category
  const menuItemsByCategory = {
    All: ['Drinks and Desserts', 'La Mian & Mini Wok', 'Fried Yong Tau Foo', 'Chinese Food', 
          'Chicken Rice', 'Vietnam Food','Mix Economic Rice', 'Korean Food'],
    Vegetarian: ['Fried Yong Tau Foo','Mix Economic Rice'],
    Halal: ['Drinks and Desserts', 'La Mian & Mini Wok', 'Fried Yong Tau Foo', 'Chinese Food', 
          'Chicken Rice', 'Vietnam Food', 'Mix Economic Rice'],
    Beverages: ['Drinks and Desserts']
  };

  const menuItemImages = {
    'Drinks and Desserts': drinksDessertImage,
    'La Mian & Mini Wok': la_mian_mini_wokImage ,
    'Fried Yong Tau Foo': fried_yong_tau_fooImage,
    'Chinese Food' : chinese_foodImage,
    'Chicken Rice' :chicken_riceImage,
    'Vietnam Food':vietnam_foodImage,
    'Mix Economic Rice': mix_economic_riceImage,
    'Korean Food': korean_foodImage,
  };

  // Filter the items based on the selected category and search query
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

export default QuadMenuScreen;
