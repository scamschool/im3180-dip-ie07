import React, { useState, useCallback, useEffect, createContext  } from 'react';
import { useFonts } from 'expo-font';
import { Audio } from 'expo-av';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import { SoundContext } from './SoundContext'; 
import { ThemeProvider } from './ThemeContext'; // Import ThemeProvider

import Location from './Location'; // Import location
import MapToggle from './MapToggle'; // Import map toggle
import PopUpQuad from './PopUpQuad'; // Import PopUpQuad component
import PopUpSS from './PopUpSS';
import SSMenuScreen from './SSMenuScreen'; 
import QuadMenuScreen from './QuadMenuScreen';

const Stack = createStackNavigator();

export default function App() {
    const [fontsLoaded] = useFonts({
        'Inter-Regular': require('./assets/fonts/Inter_18pt-Regular.ttf'),
        'Inter-Bold': require('./assets/fonts/Inter_18pt-Black.ttf'),
    });

    const [sound1, setSound1] = useState();
    const [sound2, setSound2] = useState();

    useEffect(() => {
        // Load both sounds when the app loads
        const loadSounds = async () => {
            const { sound: loadedSound1 } = await Audio.Sound.createAsync(
                require('./assets/mixkit-single-key-type-2533.wav') // Adjust path if needed
            );
            setSound1(loadedSound1);

            const { sound: loadedSound2 } = await Audio.Sound.createAsync(
                require('./assets/mixkit-mouse-click-close-1113.wav') // Adjust path if needed
            );
            setSound2(loadedSound2);
        };

        loadSounds();

        return () => {
            // Unload sounds to free up resources when the component unmounts
            if (sound1) sound1.unloadAsync();
            if (sound2) sound2.unloadAsync();
        };
    }, []);

    const playSound1 = async () => {
        try {
            if (sound1) {
                await sound1.replayAsync();
            }
        } catch (error) {
            console.log('Error playing sound1:', error);
        }
    };

    const playSound2 = async () => {
        try {
            if (sound2) {
                await sound2.replayAsync();
            }
        } catch (error) {
            console.log('Error playing sound2:', error);
        }
    };

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            // Hide the splash screen when fonts are loaded
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        // Return an empty view until fonts are loaded to prevent rendering issues
        return null;
    }

    return (
        <ThemeProvider>
        <SoundContext.Provider value={{ playSound1, playSound2 }}>
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="MapToggle"
                screenOptions={{
                    cardStyleInterpolator: ({ current, layouts }) => {
                        return {
                            cardStyle: {
                                opacity: current.progress,
                                transform: [
                                    {
                                        scale: current.progress.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.85, 1],
                                        }),
                                    },
                                ],
                            },
                        };
                    },
                }}
            >
                {/* Make sure both screens are defined in the Stack.Navigator */}
                <Stack.Screen 
                    name="Location" 
                    component={Location} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="MapToggle" 
                    component={MapToggle} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="PopUpQuad" 
                    component={PopUpQuad} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="PopUpSS" 
                    component={PopUpSS} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="SSMenuScreen" 
                    component={SSMenuScreen} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="QuadMenuScreen" 
                    component={QuadMenuScreen} 
                    options={{ headerShown: false }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
        </SoundContext.Provider>
        </ThemeProvider>
    );
}
