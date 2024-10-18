import { StyleSheet, Dimensions } from 'react-native';

// Get screen dimensions for responsive layout
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    backgroundColor: '#fff', // White background
  },
  logo: {
    width: screenWidth * 0.6, // Set image width to 60% of screen width
    height: screenHeight * 0.3, // Set image height to 30% of screen height
  },
});

export default styles;
