import { StyleSheet, Dimensions } from 'react-native';

// Get device width for responsive design
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B263B', // Dark blue background
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: -10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 120,
  },
  sectionContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#1D3F73', // Dark blue for section background
  },
  sectionHeader: {
    flexDirection: 'row', // To position the title and button side by side
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewMenuButton: {
    backgroundColor: '#fff', // White background for the button
    borderRadius: 20, // Rounded corners
    paddingVertical: 6,
    paddingHorizontal: 15,
  },
  viewMenuButtonText: {
    color: '#1D3F73', // Dark blue text color for the button
    fontWeight: 'bold',
    fontSize: 14,
  },
  chartContainer: {
    alignItems: 'center', // Center the chart horizontally
    justifyContent: 'center',
    padding: 10, // Padding for chart container
  },
  chartStyle: {
    borderRadius: 20, // Rounded corners for the chart container
    paddingVertical: 20,
  },
  openingHoursContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#1D3F73', // Dark blue background
    borderRadius: 10, // Rounded corners for the container
  },
  openingHoursBox: {
    padding: 15,
    marginTop: 10,
    backgroundColor: '#fff', // White background for hours box
    borderRadius: 10, // Rounded corners
  },
  openingHoursText: {
    fontSize: 16,
    color: '#1D3F73', // Dark blue text for hours
    marginVertical: 5, // Space between text
  },
  suggestedLocationsContainer: {
    flexDirection: 'row', // Display location image and info side by side
    alignItems: 'center',
    marginTop: 10,
  },
  locationImage: {
    width: 120, // Fixed width
    height: 120, // Fixed height
    borderRadius: 10, // Rounded corners
    marginRight: 15, // Space between image and info
  },
  locationInfo: {
    flex: 1, // Take remaining space
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // White text for location title
  },
  locationDescription: {
    fontSize: 14,
    color: '#fff', // White text for location description
    marginTop: 5, // Spacing below the title
  },
});

export default styles;
