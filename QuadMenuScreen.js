import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import styles from './QuadMenuScreenStyle'; // Import styles from the external stylesheet
import Icon from 'react-native-vector-icons/MaterialIcons'; // For back icon and search icon
import allImage from './assets/all.png'; // Example image imports
import vegetarianImage from './assets/vegetarian.png';
import halalImage from './assets/halal.png';
import beveragesImage from './assets/beverages.png';

const QuadMenuScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Categories and their associated images
  const categories = [
    { name: 'All', image: allImage },
    { name: 'Vegetarian', image: vegetarianImage },
    { name: 'Halal', image: halalImage },
    { name: 'Beverages', image: beveragesImage }
  ];

  // Menu items organized by category
  const menuItemsByCategory = {
    All: ['Drinks and Desserts', 'La Mian & Mini Wok', 'Fried Yong Tau Foo', 'Chinese Food', 
          'Chicken Rice', 'Vietnam Food','Mix Economic Rice'],
    Vegetarian: ['Fried Yong Tau Foo','Mix Economic Rice'],
    Halal: ['Drinks and Desserts', 'La Mian & Mini Wok', 'Fried Yong Tau Foo', 'Chinese Food', 
          'Chicken Rice', 'Vietnam Food', 'Mix Economic Rice'],
    Beverages: ['Drinks and Desserts']
  };

  // Filter the items based on the selected category and search query
  const filteredItems = menuItemsByCategory[selectedCategory].filter(item =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu</Text>
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
            onPress={() => setSelectedCategory(category.name)}
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
          <TouchableOpacity key={index} style={styles.menuItem}>
            <Text style={styles.menuItemText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default QuadMenuScreen;
