// ThemeContext.js
import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { SearchBar } from 'react-native-screens';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();
    
    const theme = systemColorScheme === 'dark' ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

// Define your light and dark themes
const lightTheme = {
    background: '#ffffff',
    searchBar: '#fff',
    grayBackground:'#D3D3D3',
    menuColor:'#fff',
    text: '#000000',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    chartFillShadow: '#1C3461',
    backgroundLine: '#e0e0e0',
    buttonColor: '#1C3461',
    buttonText: '#fff',
    categoryColor: '#1C3461',
};

const darkTheme = {
    background: '#1C3461',
    searchBar: '#fff',
    text: '#fff',
    whiteCard: '#fff',
    grayBackground:'#555',
    menuColor:'#000',
    borderWidth: 1,
    borderColor: '#1C3461',
    chartFillShadow: '#E2EAFC',
    backgroundLine: '#5a5a5a',
    buttonColor: '#fff',
    buttonText: '#000',
    categoryColor: '#d3d3d3',
};
