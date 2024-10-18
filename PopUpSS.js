import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Dimensions } from 'react-native';
import styles from './PopUpSsStyle';
import quadImage from './assets/quad.png';

// Helper function to convert timeslot to 12-hour format
const convertTimeslot = (timeslot) => {
  const [start] = timeslot.split(' - '); // Extract the start time (e.g., "03:00")
  const [hours, minutes] = start.split(':').map(Number); // Split hours and minutes

  // Convert to 12-hour format
  const period = hours >= 12 ? 'pm' : 'am';
  const convertedHours = hours % 12 === 0 ? 12 : hours % 12;

  return `${convertedHours}${period}`; // Return formatted time (e.g., "3am", "11am", "1pm")
};

// Fetch data from Google Sheets and filter by day
const getSheetData = async (filterDay) => {
  try {
    const response = await fetch(
      'https://sheets.googleapis.com/v4/spreadsheets/1dBDgXQRbJYZQTPfNbU1qovM5s6QG_g4XJ_9z4hEB2n0/values/Sheet1!A1:F100?key=AIzaSyBp1JCXECERdbxhx3YeqpFQAd8mM1NLdpk'
    );
    const json = await response.json();

    if (json.values && json.values.length > 0) {
      const rows = json.values.slice(1); // Skip the header row
      const headers = json.values[0]; // First row as headers

      // Filter rows based on the specified day (column E)
      const filteredRows = rows.filter(row => row[4] === filterDay);

      // Format the filtered data into an array of objects, with timeslot conversion
      const formattedData = filteredRows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          if (header === 'Timeslot') {
            obj[header] = convertTimeslot(row[index]); // Convert the timeslot
          } else {
            obj[header] = header === 'Count' ? parseFloat(row[index]) : row[index];
          }
        });
        return obj;
      });

      // Group data by Timeslot and calculate average Count
      const groupedData = formattedData.reduce((acc, row) => {
        if (!acc[row.Timeslot]) {
          acc[row.Timeslot] = { Timeslot: row.Timeslot, Counts: [] };
        }
        acc[row.Timeslot].Counts.push(row.Count);
        return acc;
      }, {});

      // Calculate the average count for each timeslot
      const result = Object.values(groupedData).map(group => {
        const total = group.Counts.reduce((sum, count) => sum + count, 0);
        const avg = total / group.Counts.length;
        return { Timeslot: group.Timeslot, AvgCount: avg };
      });

      return result.map(row => [row.Timeslot, row.AvgCount]);
    } else {
      console.warn("No 'values' field in the response or empty range");
      return [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

// PopUpQuad Component
export default function PopUpQuad({ navigation }) {
  const [popularTimesData, setPopularTimesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Google Sheets when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSheetData('Wednesday'); // Specify the day to filter for
        const times = data.map(row => row[0]); // Extract timeslot labels
        const percentages = data.map(row => parseInt(row[1], 10)); // Extract average counts
        setPopularTimesData({ labels: times, datasets: [{ data: percentages }] });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Stop loading on error
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('MapToggle')}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Information</Text>
      </View>

      {/* Popular Times Section */}
      <View style={styles.sectionContainer}>
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Popular Times at Canteen B</Text>
    <TouchableOpacity
      style={styles.viewMenuButton}
      onPress={() => {
        // Handle "View Menu" button press (navigate to menu screen or perform action)
        navigation.navigate('SSMenuScreen'); // Example navigation, change as necessary
      }}
    >
      <Text style={styles.viewMenuButtonText}>View Menu</Text>
    </TouchableOpacity>
  </View>
  <View style={styles.chartContainer}>
    {loading ? (
      <ActivityIndicator size="medium" color="#0000ff" />
    ) : (
      <BarChart
  data={popularTimesData}
  width={Dimensions.get('window').width + 60} // Reduce width slightly for more centering
  height={220}
  withHorizontalLabels={false}
  fromZero={true} // Start the chart from zero for better scaling
  showBarTops={true} // Show rounded bar tops
  chartConfig={{
    backgroundColor: '#1D3F73', // Set solid background color here
    backgroundGradientFrom: '#1D3F73', // Gradient starts with the same background color
    backgroundGradientTo: '#1D3F73', // Gradient ends with the same background color
    fillShadowGradient: '#E2EAFC', // Light blue color for bars
    fillShadowGradientOpacity: 1, // Fully opaque bars
    decimalPlaces: 0, // No decimal points in the values
    barPercentage: 0.6, // Decrease bar width for more space between bars
    color: (opacity = 1) => `rgba(173, 216, 230, ${opacity})`, // Light blue bars with opacity
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White labels
    style: {
      borderRadius: 20, // Rounded corners for the chart container
    },
    propsForBackgroundLines: {
      strokeWidth: 1, // Thinner grid lines
      stroke: '#e0e0e0', // Light gray for grid lines
      dashArray: [5, 5], // Dashed grid lines
    },
    propsForLabels: {
      fontSize: 12, // Small font size for labels
    },
    propsForBars: {
      borderRadius: 20, // Rounded corners for bars
    },
  }}
  style={{
    alignSelf: 'center', // Centralize the chart within the container
    marginRight: 40, // Reset marginRight if it's set
    //borderRadius: 16, // Rounded edges for the entire chart container
  }}
/>



    )}
  </View>
</View>

      {/* Opening Hours Section */}
      <View style={styles.openingHoursContainer}>
        <Text style={styles.sectionTitle}>Opening Hours</Text>
        <View style={styles.openingHoursBox}>
          <Text style={styles.openingHoursText}>Mon to Fri: 7am to 8pm</Text>
          <Text style={styles.openingHoursText}>Sat: 7am to 2pm</Text>
          <Text style={styles.openingHoursText}>Sun & PH: Closed</Text>
        </View>
      </View>

      {/* Suggested Locations Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Nearby Locations</Text>
        <View style={styles.suggestedLocationsContainer}>
          <Image
            source={quadImage}
            style={styles.locationImage}
          />
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>Quad Cafe - SBS</Text>
            <Text style={styles.locationDescription}>220m from Canteen B</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
