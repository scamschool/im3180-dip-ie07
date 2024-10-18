import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e2c47',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
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
    backgroundColor: '#2c3a5b',
    marginHorizontal: 5,
    borderRadius: 20,
  },
  selectedCategoryButton: {
    backgroundColor: '#445b8c', // Darker color for selected category
    borderWidth: 2, // Optionally add a border to make the selected button stand out
    borderColor: '#fff',
  },
  categoryImage: {
    width: 40,
    height: 40,
    marginBottom: 5, // To add space between the image and the text
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#ffeb3b', // Change text color of selected category
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
  },
  menuItemText: {
    color: '#1e2c47',
    fontSize: 16,
  },
});

export default styles;
