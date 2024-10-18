import React, { useState, useEffect } from 'react';
import Svg, { Rect, Path } from 'react-native-svg';
import { View, Text, TouchableOpacity, Image, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapArea1 from './assets/MapArea1.svg';
import MapArea2 from './assets/MapArea2.svg';
import styles from './MapToggleStyle';
import lionImage from './assets/lion.png';

const ssLion = lionImage;
const quadLion = lionImage;

// Custom SVG Component with Dynamic Color for Path
const CustomMapArea1 = ({ pathColor }) => (
  <Svg width="250" height="250" viewBox="0 0 190 199" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Rect width="190" height="199" fill="none" />
    <Path
      d="M86.9191 74.8925L0 98.4301L12.0809 199L190 149.785L159.798 0L82.9191 15.5134V74.8925Z"
      fill={pathColor}
    />
  </Svg>
);

// Function to compare the time range in row[5]
const isInPredefinedTimeRange = (timeRange) => {
  // Let's assume the predefined time range is "17:00 to 19:00"
  const predefinedTimeRange = '17:00 - 19:00';

  return timeRange === predefinedTimeRange;
};

// Fetch data from Google Sheets and filter by today's date
const fetchGoogleSheetData = async () => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  try {
    const response = await fetch(
      'https://sheets.googleapis.com/v4/spreadsheets/1dBDgXQRbJYZQTPfNbU1qovM5s6QG_g4XJ_9z4hEB2n0/values/Sheet1!A1:F77?key=AIzaSyBp1JCXECERdbxhx3YeqpFQAd8mM1NLdpk'
    );
    const json = await response.json();
    if (json.values && json.values.length > 0) {
      const rows = json.values.slice(1); // Skip the header row

      // Filter by today's date
      const filteredRows = rows.filter(row => row[3].split(' ')[0] === today); // Assuming date is in column 4

      return filteredRows;
    } else {
      console.warn("No 'values' field in the response or empty range");
      return [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export default function MapToggle({ navigation }) {
  const [pathColor, setPathColor] = useState("#95E9A4"); // Initial color for the path

  useEffect(() => {
    const fetchDataAndCheckTime = async () => {
      const data = await fetchGoogleSheetData();
      
      if (data.length > 0) {
        // Check each row's time range (assuming it's in the last column, index 5)
        data.forEach(row => {
          const timeRange = row[5]; // Assuming time range is in the 6th column (index 5)
          if (isInPredefinedTimeRange(timeRange)) {
            setPathColor(pathColor =="#FF6347"); // Set path color to red if the time range matches
          }
        });
      }
    };

    fetchDataAndCheckTime();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Map</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Location')}>
          <Icon name="swap-vert" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.mapArea1}>
        <CustomMapArea1 pathColor={pathColor} />

        <TouchableOpacity onPress={() => navigation.navigate('PopUpQuad')} style={{ position: 'absolute', top: -10, left: 0 }}>
          <Image source={quadLion} style={styles.quadLion} />
        </TouchableOpacity>

        <Text style={styles.quadText}>Quad Cafe</Text>
      </View>

      <View style={styles.mapArea2}>
        <MapArea2 width={500} height={500} />
        <TouchableOpacity onPress={() => navigation.navigate('PopUpSS')} style={{ position: 'absolute', top: -10, left: 0 }}>
          <Image source={ssLion} style={styles.ssLion} />
        </TouchableOpacity>
        <Text style={styles.ffText}>Canteen B</Text>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#90EE90' }]} />
          <Text style={styles.legendText}>Low</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FFA500' }]} />
          <Text style={styles.legendText}>Moderate</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FF6347' }]} />
          <Text style={styles.legendText}>High</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Toggle Color" onPress={() => setPathColor(pathColor === "#95E9A4" ? "#FF6347" : "#95E9A4")} />
      </View>
    </View>
  );
}
