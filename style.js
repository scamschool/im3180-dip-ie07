import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';


// Get device width for responsive design
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const { width, height } = Dimensions.get('window');

const createChartConfig = (theme) => ({
  backgroundColor: theme.background,
  backgroundGradientFrom: theme.background,
  backgroundGradientTo: theme.background,
  fillShadowGradient: theme.chartFillShadow,
  fillShadowGradientOpacity: 1,
  decimalPlaces: 0,
  barPercentage: 0.6,
  color: (opacity = 1) => `rgba(173, 216, 230, ${opacity})`, // Customize this color if needed for light or dark mode
  labelColor: (opacity = 1) => theme.text, // Use theme text color for labels
  propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: theme.backgroundLine, // Add a color for the background line based on the theme
      dashArray: [5, 5],
  },
});

  export const createStyles = (theme) => {
    return StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background, // Dark blue background for safe area
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background, // Dark blue background color
    paddingHorizontal: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: theme.background,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    color: theme.text,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    backgroundColor: theme.background,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    backgroundColor: theme.background, // White background
  },
  logo: {
    width: screenWidth * 0.6, // Set image width to 60% of screen width
    height: screenHeight * 0.3, // Set image height to 30% of screen height
    
  },
   // Map Area styles
   mapArea1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: height * 0.1,
    paddingRight: scale(150),
    paddingTop: verticalScale(0),
    backgroundColor: theme.background,
  },
  mapArea2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
    width: '100%',
    height: height * 0.5, // 50% of screen height
    bottom: verticalScale(90),
    overflow: 'hidden',
},


  // Quad and South Spine Canteen styles
  quadContainer: {
    position: 'absolute',
    top: verticalScale(100),
    left: scale(80),
    alignItems: 'center',
    zIndex: 2,
  },
  ssContainer: {
    position: 'absolute',
    top: verticalScale(150),
    left: scale(120),
    alignItems: 'center',
    zIndex: 1,
  },
  quadLion: { 
    width: scale(60),
    height: scale(60),
  },
  ssLion: { 
    width: scale(60),
    height: scale(60),
  },
  quadText: {
    fontSize: moderateScale(14),
    marginTop: verticalScale(5),
    color: '#000',
    fontFamily: 'Inter-Bold',
  },
  ssText: {
    fontSize: moderateScale(14),
    marginTop: verticalScale(5),
    color: '#000',
    fontFamily: 'Inter-Bold',
  },

  // Legend styles
  legend: {
    position: 'absolute',
    top: verticalScale(60),
    right: scale(20),
    backgroundColor: '#808080',
    borderRadius: scale(10),
    padding: scale(10),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  legendColor: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    marginRight: scale(8),
  },
  legendText: {
    color: theme.text,
    fontSize: moderateScale(16),
    fontFamily: 'Inter-Regular'
  },

  // Info Icon
  infoIcon: {
    position: 'absolute',
    top: scale(10),
    right: scale(10),
    zIndex: 1,
    backgroundColor: theme.backgroundColor,
    color: theme.text,
  },

  searchContainer: {
    flexDirection: 'row',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: theme.borderWidth,
    borderColor: theme.borderColor,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#000',
  },
  canteenList: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 3,
    borderWidth: theme.borderWidth,
    borderColor: theme.borderColor,
  },
  image: {
    width: 100,
    height: 130,
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    paddingHorizontal: 16,
  },
  titleText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold'
  },
  description: {
    marginVertical: 4,
    color: '#555',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 10,
  },
  statusText: {
    fontSize: 14,
    marginRight: 8,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  clockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto', // Aligns the clock container to the right
  },
  timeText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#555',
  },
  sectionContainer: {
    marginTop: 5,
    padding: 10,
    backgroundColor: theme.background,
  },
  sectionHeader: {
    flexDirection: 'row', // To position the title and button side by side
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: theme.background,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: theme.text,
  },
  viewMenuButton: {
    backgroundColor: theme.buttonColor, 
    borderRadius: 20, // Rounded corners
    paddingVertical: 6,
    paddingHorizontal: 15,
    color: theme.text,
  },
  viewMenuButtonText: {
    color: theme.buttonText, // Dark blue text color for the button
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  selectedBarInfoContainer: {
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: theme.buttonColor,
    borderRadius: 10,
  },
  selectedBarInfoText: {
    fontSize: 14,           
    color: theme.buttonText,      
    fontFamily: 'Inter-Regular',
    textAlign: 'center',    
    paddingVertical: 5,     
    paddingHorizontal: 10,  
    backgroundColor: theme.buttonColor, 
    borderRadius: 10,        
    letterSpacing: 0.5,     
    lineHeight: 22,         
  },
  chartContainer: {
    alignItems: 'center', // Center the chart horizontally
    justifyContent: 'center', // Center vertically if needed
    padding: 10,
  },
  chartStyle: {
    alignSelf: 'center',
    marginRight: 40,
  },
  openingHoursContainer: {
    marginTop: 5,
    padding: 10,
    backgroundColor: theme.background, // Dark blue background
    borderRadius: 10, // Rounded corners for the container
 
  },
  openingHoursBox: {
    padding: 15,
    marginTop: 10,
    backgroundColor: '#fff', // White background for hours box
    borderRadius: 10, // Rounded corners
    borderWidth: theme.borderWidth,
    borderColor: theme.borderColor,
  },
  openingHoursText: {
    fontSize: 16,
    color: '#000', // Black text for hours
    marginVertical: 5, // Space between text
    fontFamily: 'Inter-Regular',
  },
  suggestedLocationsContainer: {
    flexDirection: 'row', // Display location image and info side by side
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 10,
    borderWidth: theme.borderWidth,
    borderColor: theme.borderColor,
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
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000', // White text for location title
  },
  locationDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginTop: 5, // Spacing below the title
  },
  placeholderIcon: {
    width: 24, // Placeholder space to balance the layout
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    marginVertical: 15,
    paddingHorizontal: 15,
    height: 40,
    borderWidth: theme.borderWidth,
    borderColor: theme.borderColor,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: theme.background,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  selectedCategoryButton: {
    backgroundColor: theme.categoryColor, // Darker color for selected category
  },
  categoryImage: {
    width: 40,
    height: 40,
    marginBottom: 5, // To add space between the image and the text
  },
  categoryText: {
    color: theme.text,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  selectedCategoryText: {
    fontFamily: 'Inter-Regular',
    color: theme.buttonText,
  },
  menuContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  menuItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: theme.borderWidth,
    borderColor: theme.borderColor,
  },
  menuItemText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: theme.categoryColor,
    borderRadius: 10,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 10,
    color: theme.menuColor,
  },
  modalImage: {
    width: 150,
    height: 150,
    marginBottom: 20
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.menuColor,
    borderRadius: 5
  },
  closeButtonText: {
    color: theme.text,
    fontFamily: 'Inter-Bold',
  }
});
};

export { createChartConfig };
