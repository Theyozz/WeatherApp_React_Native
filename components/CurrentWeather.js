import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ImageBackground,
    TextInput,
    Button,
    ScrollView,
} from 'react-native';
import axios from 'axios';
import ShowIcon from './ShowIcon';  // Ce composant affichera les icônes

const API_KEY = 'd6def4924ad5f9a9b59f3ae895b234cb';  // Votre clé API
const UNIT = 'metric';  // Unité pour la température (Celsius)

const CurrentWeather = () => {
    const [city, setCity] = useState('Lyon'); // Ville par défaut
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [coordinates, setCoordinates] = useState(null);

    // Fonction pour récupérer la géolocalisation de la ville
    const fetchCityCoordinates = async (cityName) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
            );
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                setCoordinates({ lat, lon });
                fetchWeather(lat, lon); // Utilisation de la géolocalisation pour récupérer la météo actuelle et les prévisions
            }
        } catch (err) {
            setError('Erreur lors de la recherche de la ville');
            setLoading(false);
        }
    };

    // Fonction pour récupérer la météo actuelle et les prévisions
    const fetchWeather = async (lat, lon) => {
        try {
            setLoading(true);
            const weatherResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${UNIT}&appid=${API_KEY}`
            );
            setWeather(weatherResponse.data);

            const forecastResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${UNIT}&appid=${API_KEY}`
            );
            setForecast(forecastResponse.data.list);
            setLoading(false);
        } catch (err) {
            setError('Erreur lors de la récupération des données météo');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCityCoordinates(city);  // Récupère la géolocalisation de la ville par défaut
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Erreur: {error}</Text>
            </View>
        );
    }

    // Groupement des prévisions par jour
    const groupForecastByDay = () => {
        const days = {};
        forecast.forEach((item) => {
            const date = new Date(item.dt * 1000);
            const day = date.toLocaleDateString('fr-FR', { weekday: 'long' });
            if (!days[day]) {
                days[day] = [];
            }
            days[day].push({
                time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                icon: item.weather[0].icon,
                temp: Math.round(item.main.temp),
            });
        });

        // Limiter à 3 prévisions par jour (matin, après-midi, soir)
        const limitedDays = Object.entries(days).slice(0, 5).map(([day, forecasts]) => {
            return [
                day,
                [
                    forecasts[0], // Matin
                    forecasts[Math.floor(forecasts.length / 2)], // Après-midi
                    forecasts[forecasts.length - 1], // Soir
                ],
            ];
        });

        return limitedDays;
    };

    const groupedForecast = groupForecastByDay();

    return (
        <ImageBackground
            source={{
                uri: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&w=1080&h=1920&fit=max',
            }}
            resizeMode="cover"
            style={styles.background}
        >
            {/* Barre de recherche */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Entrez une ville"
                    placeholderTextColor="#cccccc"
                    value={city}
                    onChangeText={setCity}
                />
                <Button title="Rechercher" onPress={() => fetchCityCoordinates(city)} />
            </View>

            {/* Contenu principal */}
            <View style={styles.content}>
                <Text style={styles.cityName}>{weather.name}</Text>
                <Text style={styles.time}>
                    {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <ShowIcon iconCode={weather.weather[0].icon} size={100} />
                <Text style={styles.temperature}>{weather.main.temp}°C</Text>
                <Text style={styles.description}>
                    {weather.weather[0].description.charAt(0).toUpperCase() +
                        weather.weather[0].description.slice(1)}
                </Text>
            </View>

            {/* Prévisions météo */}
            <View style={styles.forecastContainer}>
                <Text style={styles.forecastTitle}>Prévisions sur 5 jours</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {groupedForecast.map(([day, forecasts], index) => (
                        <View key={index} style={styles.dayContainer}>
                            <Text style={styles.dayTitle}>{day}</Text>
                            {forecasts.map((item, i) => (
                                <View key={i} style={styles.hourlyForecast}>
                                    <Text style={styles.time}>{item.time}</Text>
                                    <ShowIcon iconCode={item.icon} size={30} />
                                    <Text style={styles.temp}>{item.temp}°C</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    searchContainer: {
        position: 'absolute',
        top: 50,
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 8,
        padding: 8,
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        color: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        marginRight: 8,
    },
    content: {
        alignItems: 'center',
        marginTop: 120,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 16,
        borderRadius: 16,
        marginHorizontal: 16,
    },
    cityName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    time: {
        fontSize: 22,
        color: '#fff',
        marginBottom: 8,
    },
    temperature: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
        marginVertical: 4,
    },
    description: {
        fontSize: 18,
        fontStyle: 'italic',
        color: '#fff',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
    forecastContainer: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 8,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    forecastTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
        textAlign: 'center',
    },
    dayContainer: {
        marginHorizontal: 6,
    },
    dayTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
        textAlign: 'center',
    },
    hourlyForecast: {
        alignItems: 'center',
        marginHorizontal: 4,
    },
    time: {
        fontSize: 22,
        color: '#fff',
    },
    temp: {
        fontSize: 10,
        color: '#fff',
    },
});

export default CurrentWeather;
