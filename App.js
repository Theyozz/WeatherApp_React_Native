import React from 'react';
import { SafeAreaView } from 'react-native';
import CurrentWeather from './components/CurrentWeather';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CurrentWeather />
    </SafeAreaView>
  );
};

export default App;