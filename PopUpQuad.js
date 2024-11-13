import React, { useState, useCallback, useEffect, useContext} from 'react';
import { SafeAreaView, Platform, View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Modal, Dimensions  } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StatusBar } from 'expo-status-bar';
import ssImage from './assets/ss.png';
import { SoundContext } from './SoundContext'; 
import { useTheme } from './ThemeContext';
import { createStyles, createChartConfig } from './style';


// Helper function to change a timeslot (like "11:00 - 13:00") into 12-hour format (like "11am")
const convertTimeslotTo12Hour = (timeslot) => {
  const [startTime] = timeslot.split(' - '); // Extract the start time (e.g., "11:00" from "11:00 - 13:00")
  const [hours, minutes] = startTime.split(':').map(Number); // Split hours and minutes
  
  // Check if it's AM or PM
  const period = hours >= 12 ? 'pm' : 'am';
  const convertedHours = hours % 12 === 0 ? 12 : hours % 12;

  return `${convertedHours}${period}`; // Return formatted time (e.g., "11am")
};

// Another helper function to convert a 12-hour time (like "11am") to 24-hour time for sorting
const convertTo24HourForSort = (timeslot) => {
  const period = timeslot.slice(-2); // Get 'am' or 'pm'
  let hours = parseInt(timeslot.slice(0, -2), 10); // Extract the hour part

  // Adjust hours based on AM/PM
  if (period === 'pm' && hours !== 12) hours += 12;
  if (period === 'am' && hours === 12) hours = 0;

  return hours;
};
  
  // Function to get data from Google Sheets and filter it based on the selected day (like "Monday")
  const getSheetData = async (filterDay) => {
    try {
      const response = await fetch(
        'https://sheets.googleapis.com/v4/spreadsheets/1dBDgXQRbJYZQTPfNbU1qovM5s6QG_g4XJ_9z4hEB2n0/values/Sheet1!A1:F999?key=AIzaSyBp1JCXECERdbxhx3YeqpFQAd8mM1NLdpk'
      );
      const json = await response.json();
  
      if (json.values && json.values.length > 0) {
        const rows = json.values.slice(1); // Skip the header row
        const headers = json.values[0]; // First row as headers
  
        // Only keep rows that match the selected location
        const filteredRows = rows.filter(row => row[2] === filterDay);
  
        // Convert rows to objects and change timeslots to 12-hour format
        const formattedData = filteredRows.map(row => {
          const obj = {};
          headers.forEach((header, index) => {
            if (header === 'Timeslot') {
              obj[header] = convertTimeslotTo12Hour(row[index]); // Convert to 12-hour format and use start time only
            } else {
              obj[header] = header === 'Count' ? parseFloat(row[index]) : row[index];
            }
          });
          return obj;
        });
  
        // Group data by unique Timeslot and calculate average Count for each unique timeslot
        const groupedData = formattedData.reduce((acc, row) => {
          if (!acc[row.Timeslot]) {
            acc[row.Timeslot] = { Timeslot: row.Timeslot, total: 0, count: 0 }; // Initialize accumulator
          }
          acc[row.Timeslot].total += row.Count; // Sum the counts
          acc[row.Timeslot].count += 1; // Count occurrences
          return acc;
        }, {});
  
        // Calculate the average count for each unique timeslot
        const result = Object.values(groupedData).map(group => ({
          Timeslot: group.Timeslot,
          AvgCount: group.total / group.count, // Average the count
        }));
  
        // Sort the results in chronological order based on 24-hour time (earliest to latest)
        result.sort((a, b) => convertTo24HourForSort(a.Timeslot) - convertTo24HourForSort(b.Timeslot));
  
        return result.map(row => [row.Timeslot, row.AvgCount]); // Return result as array of timeslots and average counts
      } else {
        console.warn("No 'values' field in the response or empty range");
        return [];
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };
  
    const getAverageCountMessage = (count) => {
      if (count < 40) {
        return 'Relaxed – Easy to grab a seat!';
      } else if (count >= 40 && count <= 120) {
        return 'Buzzing - Getting Crowded!';
      } else {
        return 'Jam-packed!';
      }
    };

  // Main component to display information about Quad Cafe
  export default function PopUpQuad({ navigation }) {
    const theme = useTheme();
    const styles = createStyles(theme);
    const chartConfig = createChartConfig(theme);

    const { playSound1, playSound2 } = useContext(SoundContext);

    const [popularTimesData, setPopularTimesData] = useState({ labels: [], datasets: [{ data: [] }] });
    const [loading, setLoading] = useState(true);
    const [selectedBar, setSelectedBar] = useState(null); // Store selected bar data
    const [showModal, setShowModal] = useState(false); // Show modal for counts
  
    // Fetch data from Google Sheets when the component mounts
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getSheetData('SBS Quad Canteen'); // Get data for "Quad Cafe" only
          const times = data.map(row => row[0]); // Extract unique timeslot labels
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

    const handlePressIn = (label, count) => {
      setSelectedBar({ label, count }); // Show the statement when pressing down
    };
  
    const handlePressOut = () => {
      setSelectedBar(null); // Clear the statement when releasing
    };

  // Define the chart width and calculate the width of each touchable area dynamically
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 60; // Adjust for padding/margin if necessary
  const barWidth = (chartWidth / popularTimesData.labels.length) * 0.6; // Calculate the width of each bar

    return (
      <SafeAreaView style={styles.safeArea}>
      <StatusBar style={theme.background === '#1C3461' ? 'light' : 'dark'} />
      <ScrollView style={styles.container}>
          {/* Header Section */}
          <View style={styles.header}>
          <TouchableOpacity
                  onPress={() => {
                      playSound2(); // Play the sound
                      navigation.goBack(); // Navigate back
                  }}
              >
              <Icon name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Information</Text>
          </View>
  
          {/* Popular Times Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Times at Quad Cafe</Text>
              <TouchableOpacity
                style={styles.viewMenuButton}
                onPress={() => {
                    playSound1(); // Play the sound
                    navigation.navigate('QuadMenuScreen'); // Navigate to 'QuadMenuScreen'
                }}
                >
                <Text style={styles.viewMenuButtonText}>View Menu</Text>
              </TouchableOpacity>
            </View>

            {/* Display selected bar info above the chart */}
            {selectedBar && (
              <View style={styles.selectedBarInfoContainer}>
                <Text style={styles.selectedBarInfoText}>
                {`${selectedBar.label}, ${selectedBar.count} people - ${getAverageCountMessage(selectedBar.count)}`}
                </Text>
              </View>
            )}

            <View style={styles.chartContainer}>
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <>
                  <BarChart
                  data={popularTimesData}
                  width={Dimensions.get('window').width + 60}
                    height={220}
                  fromZero={true}
                  withHorizontalLabels={false} // Hide y-axis counts
                  chartConfig={chartConfig}
                  style={styles.chartStyle} // Apply chartStyle for specific chart styling
                />
  
                  {/* Overlay touchable areas for each bar */}
                {!loading && popularTimesData.labels.length > 0 && (
                  <View style={{ position: 'absolute', top: 0, left: 30, width: chartWidth, height: 220, flexDirection: 'row' }}>
                    {popularTimesData.labels.map((label, index) => (
                      <TouchableOpacity
                        key={index}
                        onPressIn={() => handlePressIn(label, popularTimesData.datasets[0].data[index])}
                        onPressOut={handlePressOut}
                        style={{ 
                          width: barWidth, 
                          height: 200,
                          marginRight: 15,
                          right: 27.5,
                          marginHorizontal: (chartWidth / popularTimesData.labels.length - barWidth) / 2,
                        }}
                      />
                    ))}
                  </View>
                )}
                </>
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
            <TouchableOpacity onPress={() => {
                  playSound1(); // Play the sound
                  navigation.navigate('PopUpSS'); 
              }}>
              <View style={styles.suggestedLocationsContainer}>
                <Image source={ssImage} style={styles.locationImage} />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationTitle}>Canteen B - South Spine</Text>
                  <Text style={styles.locationDescription}>220m from Canteen B</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
}
