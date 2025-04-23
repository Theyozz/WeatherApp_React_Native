import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './components/HomeScreen';
import RainForecastScreen from './components/RainForecastScreen';
import CitySearchScreen from './components/CitySearchScreen';
import { Ionicons } from 'react-native-vector-icons';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Accueil') {
              iconName = 'home';
            } else if (route.name === 'Pluie') {
              iconName = 'rainy';
            } else if (route.name === 'Recherche') {
              iconName = 'search';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'dodgerblue',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Accueil" component={HomeScreen} />
        <Tab.Screen name="Pluie" component={RainForecastScreen} />
        <Tab.Screen name="Recherche" component={CitySearchScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
