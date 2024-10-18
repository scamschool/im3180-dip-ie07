import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Location from './Location'; // Import location
import MapToggle from './MapToggle'; // Import map toggle
import PopUpQuad from './PopUpQuad'; // Import PopUpQuad component
import PopUpSS from './PopUpSS';
import DisplayGData from './DisplayGData'; 
import SSMenuScreen from './SSMenuScreen'; 
import QuadMenuScreen from './QuadMenuScreen';
import WelcomePage from './WelcomePage'; 

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="WelcomePage"
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
                    name="WelcomePage" 
                    component={WelcomePage} 
                    options={{ headerShown: false }}
                />
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
                    name="DisplayGData" 
                    component={DisplayGData} 
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
    );
}
