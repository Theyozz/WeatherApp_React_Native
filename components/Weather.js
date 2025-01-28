import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ShowIcon from './ShowIcon'; // Importez le composant ShowIcon

const Weather = ({ forecast }) => {
    // Conversion de l'heure à partir de la date/heure Unix
    const date = new Date(forecast.dt * 1000); // forecast.dt est en secondes
    const time = `${date.getHours()}:00`; // Format de l'heure (par ex. "14:00")

    return (
        <View style={styles.container}>
            {/* Affiche l'heure */}
            <Text style={styles.time}>{time}</Text>

            {/* Affiche l'icône météo */}
            <ShowIcon iconCode={forecast.weather[0].icon} size={50} />

            {/* Affiche la température */}
            <Text style={styles.temperature}>{Math.round(forecast.main.temp)}°C</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: 8,
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    time: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    temperature: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
    },
});

export default Weather;
