import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const RainForecastScreen = () => {
    return (
        <View style={{ flex: 1 }}>
            <WebView
                source={{
                    uri: 'https://openweathermap.org/weathermap?basemap=map&cities=true&layer=precipitation&lat=45.75&lon=4.85&zoom=8',
                }}
                style={styles.map}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
});

export default RainForecastScreen;
