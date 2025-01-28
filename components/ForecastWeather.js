import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Weather from './Weather'; // Import du composant Weather (assurez-vous qu'il est défini)

const ForecastWeather = ({ data }) => {
    const [groupedForecast, setGroupedForecast] = useState([]);

    useEffect(() => {
        if (data) {
            // Groupement des prévisions par jour
            const forecastByDay = data.reduce((acc, curr) => {
                const date = new Date(curr.dt * 1000); // Conversion timestamp en date
                const day = date.toISOString().split('T')[0]; // Récupère la date (YYYY-MM-DD)

                if (!acc[day]) acc[day] = [];
                acc[day].push(curr);

                return acc;
            }, {});

            // Convertir l'objet en tableau
            const groupedData = Object.keys(forecastByDay).map(day => ({
                day,
                forecasts: forecastByDay[day],
            }));

            setGroupedForecast(groupedData);
        }
    }, [data]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Prévisions météo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                {groupedForecast.map(group => (
                    <View key={group.day} style={styles.dayContainer}>
                        <Text style={styles.dayText}>{group.day}</Text>
                        <ScrollView horizontal>
                            {group.forecasts.map(forecast => (
                                <Weather key={forecast.dt} forecast={forecast} />
                            ))}
                        </ScrollView>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    scrollView: {
        flexDirection: 'row',
    },
    dayContainer: {
        marginRight: 16,
        backgroundColor: '#ffffff',
        padding: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    dayText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

export default ForecastWeather;
