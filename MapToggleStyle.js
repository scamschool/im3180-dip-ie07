// MapToggleStyle.js
import { StyleSheet } from 'react-native';

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
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  mapArea1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 80,
    paddingRight: 250,
    backgroundColor: '#2C3E50'
  },

  mapArea2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 150,
    paddingRight: 0,
    backgroundColor: '#2C3E50'
  },
  quadLion: {
    width: 80, // Set the width of the image
    height: 80, // Set the height of the image
    position: 'absolute', // Absolute positioning for precise placement
    top: 150, // Adjust position
    left: 90, // Adjust position
  },
  buttonContainer: {
    marginTop: 20,
  },
  ssLion: {
    width: 80,
    height: 80,
    position: 'absolute',
    top: 120,
    left: 150,
  },
  quadText: {
    fontSize: 16,  // Font size of the text
    fontWeight: 'bold',  // Make the text bold
    position: 'absolute', // Absolute positioning for precise placement
    top: 200, // Adjust position
    left: 10, // Adjust position
  },
  ffText: {
    fontSize: 16,  // Font size of the text
    fontWeight: 'bold',  // Make the text bold
    position: 'absolute', // Absolute positioning for precise placement
    top: 180, // Adjust position
    left: 80, // Adjust position
  },
  mapBlock: {
    width: 120,
    height: 120,
    backgroundColor: '#90EE90',
    borderWidth: 5,
    borderColor: '#404040',
    margin: 10,
  },
  legend: {
    position: 'absolute',
    top: 140,
    right: 20,
    backgroundColor: '#808080',
    borderRadius: 10,
    padding: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  legendText: {
    color: '#fff',
  },
});

export default styles;
