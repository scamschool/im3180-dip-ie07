//MapToggle.js
import React, {useState, useCallback, useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { scale, verticalScale} from 'react-native-size-matters';
import Svg, { Rect, Path } from 'react-native-svg';
import { SafeAreaView, Platform, Dimensions, View, Text, TouchableOpacity, Image, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapArea1 from './assets/MapArea1.svg';
import MapArea2 from './assets/MapArea2.svg';
import lionImage from './assets/lion.png';
import { SoundContext } from './SoundContext';
import { useTheme } from './ThemeContext';
import { createStyles, chartConfig } from './style';


// Constants for static images representing the lion icon for two locations
const ssLion = lionImage;
const quadLion = lionImage;
const { width, height } = Dimensions.get('window'); // Get the screen dimensions

// Custom Map Area 1 SVG Component with Dynamic Color for Path
const CustomMapArea1 = ({ pathColor }) => (
  <Svg width="100%" height="100%" viewBox="0 0 190 199" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Rect width="190" height="199" fill='none' />
    <Path
      d="M61.9191 74.8925L-21 98.4301L-8.91908 199L169 149.785L138.798 0L61.9191 15.5134V74.8925Z"
      fill={pathColor}
    />
  </Svg>
);

// Custom Map Area 2 SVG Component with Dynamic Color for Path
const CustomMapArea2 = ({ pathColor2 }) => (
  <Svg
    width="150%" height="100%"
    viewBox="0 0 490 326"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Rect width="490" height="326" fill='none' />
    <Path
      d="M203.51 0L134.901 15.8673V56.7375L0 71.1622V115.398L134.901 106.263V226.95L27.351 250.029L51.457 315.422L189.603 281.764L237.351 326L343.51 299.555L381.06 115.398L469.603 88.472L445.96 15.8673L356.954 56.7375L343.51 0H293.907V189.445H237.351L203.51 0Z"
      fill={pathColor2}
    />
    <Path
      d="M104.305 134.631H66.755L42.649 212.525H104.305V134.631Z"
      fill={pathColor2}
    />
    <Path
      d="M469.603 115.398L397.748 134.631V237.528L490 212.525L469.603 115.398Z"
      fill={pathColor2}
    />
  </Svg>
);

// Helper function to convert dateTime to epoch time for comparison
const convertToEpoch = (dateTime) => new Date(dateTime).getTime();

// Function to fetch data from Google Sheets and filter it by today's date and specified location
const fetchGoogleSheetData = async (location) => {
  try {
    const response = await fetch(
      'https://sheets.googleapis.com/v4/spreadsheets/1dBDgXQRbJYZQTPfNbU1qovM5s6QG_g4XJ_9z4hEB2n0/values/Sheet1!A1:F999?key=AIzaSyBp1JCXECERdbxhx3YeqpFQAd8mM1NLdpk'
    );
    const json = await response.json();
    if (json.values && json.values.length > 0) {
      const rows = json.values.slice(1); // Skip the header row for data rows only

      const today = new Date().toISOString().split('T')[0]; // Get today's date in "YYYY-MM-DD"

      // Filter rows by today's date and location
      const filteredRows = rows.filter(row => {
        const [datePart] = row[3].split(' '); // Split the date and time
        return datePart === today && row[2] === location; // Check if date matches today and location matches
      });

      // Sort the filtered rows by time (latest time first)
      const sortedRowsByTime = filteredRows.sort((a, b) => {
        const timeA = a[3].split(' ')[1]; // Extract the time part from Date Time
        const timeB = b[3].split(' ')[1];
        return timeB.localeCompare(timeA); // Sort by descending time (latest time first)
      });

      return sortedRowsByTime;
    } else {
      console.warn("No 'values' field in the response or empty range");
      return [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

// Main component
export default function MapToggle({ navigation }) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const { playSound1, playSound2 } = useContext(SoundContext);

  // Initial states for path colors and estimated times for both map areas
  const [pathColor, setPathColor] = useState("#95E9A4"); // Default color for the MapArea1
  const [pathColor2, setPathColor2] = useState("#95E9A4"); // Default color for MapArea2
  const [timeEstimateQuad, setTimeEstimateQuad] = useState("5 min"); // Initial time estimate for Quad Cafe
  const [timeEstimateCanteenB, setTimeEstimateCanteenB] = useState("5 min"); // Initial time estimate for Canteen B

    // Function to refresh the page by reloading the component
  const handleRefresh = () => {
    navigation.replace('MapToggle'); // Replace the current page with itself
  };

  useEffect(() => {
     // Function to fetch data for specific locations and update path colors and wait times based on data
    const fetchDataAndCheckTime = async () => {
      
      const location1 = 'South Spine Canteen'; 
      const location2 = 'Quad Cafe';
      
      // Fetch and process data for South Spine Canteen
      const data1 = await fetchGoogleSheetData(location1);
      if (data1.length > 0) {
        const latestRow1 = data1[0]; // Get the latest row for South Spine Canteen
        const count1 = parseInt(latestRow1[1]); // Assuming row[1] holds the count
  
        // Apply color logic based on the count for South Spine Canteen
        if (count1 <= 80) {
          setPathColor2("#90EE90"); // Green for <= 60
          setTimeEstimateCanteenB("5 min"); // Set to 5 min for green
        } else if (count1 <= 160) {
          setPathColor2("#FFA500"); // Orange for <= 160
          setTimeEstimateCanteenB("10 min"); // Set to 10 min for orange
        } else {
          setPathColor2("#FF6347"); // Red for > 120
          setTimeEstimateCanteenB("15 min"); // Set to 15 min for red
        }
      }
  
      // Fetch and process data for Quad Cafe
      const data2 = await fetchGoogleSheetData(location2);
      if (data2.length > 0) {
        const latestRow2 = data2[0]; // Get the latest row for Quad Cafe
        const count2 = parseInt(latestRow2[1]); // Assuming row[1] holds the count
  
        // Apply color logic based on the count for Quad Cafe
        if (count2 <= 40) {
          setPathColor("#90EE90"); // Green for <= 40
          setTimeEstimateQuad("5 min");
        } else if (count2 <= 80) {
          setPathColor("#FFA500"); // Orange for <= 80
          setTimeEstimateQuad("10 min");
        } else {
          setPathColor("#FF6347"); // Red for > 120
          setTimeEstimateQuad("15 min");
        }
      }
    };
  
    fetchDataAndCheckTime(); // Fetch data once when component mounts
  }, []); // Empty array means this runs once on mount
  
  //Display component
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
        <Text style={styles.title}>Map</Text>
        <TouchableOpacity onPress={() => {
            playSound1(); // Play the sound
            navigation.navigate('Location', { timeEstimateQuad, timeEstimateCanteenB }); // Navigate to the 'Location' screen
        }}>
          <Icon name="swap-vert" size={24} color={theme.text}/>
        </TouchableOpacity>
      </View>

      <View style={styles.mapArea1}>
  <CustomMapArea1 pathColor={pathColor}/>
  {/* Wrapper container for image and text */}
  <View style={styles.quadContainer}>
  <TouchableOpacity onPress={() => {
    playSound1(); // Play the sound
    navigation.navigate('PopUpQuad'); // Navigate to the 'PopUpQuad' screen
}}>
      <Image source={quadLion} style={styles.quadLion} />
    <Text style={styles.quadText}>Quad Cafe</Text>
    </TouchableOpacity>
  </View>
</View>

<View style={styles.mapArea2}>
  <CustomMapArea2 pathColor2={pathColor2}/>

  {/* Wrapper container for image and text */}
  <View style={styles.ssContainer}>
  <TouchableOpacity onPress={() => {
    playSound1(); // Play the sound
    navigation.navigate('PopUpSS'); // Navigate to the 'PopUpQuad' screen
}}>
      <Image source={ssLion} style={styles.ssLion} />
    
    <Text style={styles.ssText}>Canteen B</Text>
    </TouchableOpacity>
  </View>
</View>

      <View style={styles.legend}>
        {/* Information Icon in the Top Right Corner */}
        <TouchableOpacity style={styles.infoIcon} onPress={() => Alert.alert(
      'Crowd Levels',
      `🥦 Green - Peaceful vibes, plenty of seats!\n🍊 Orange - Getting lively, seats filling up!\n🍅 Red - Food fest! Expect a bustling crowd!`
    )}>
          <Icon name="info" size={24} color={theme.text} />
        </TouchableOpacity>
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

    </View>
    </SafeAreaView>
  );
}
