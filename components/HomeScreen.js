import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ImageBackground,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import ShowIcon from './ShowIcon';

const API_KEY = 'd6def4924ad5f9a9b59f3ae895b234cb';
const UNIT = 'metric';

const HomeScreen = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getWeatherFromCoords = async (lat, lon) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${UNIT}&appid=${API_KEY}`
            );
            setWeather(response.data);
        } catch (err) {
            setError('Erreur de récupération météo');
        } finally {
            setLoading(false);
        }
    };

    const getLocation = async () => {
        try {
            setLoading(true);
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    setError('Permission refusée');
                    setLoading(false);
                    return;
                }
            }

            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    getWeatherFromCoords(latitude, longitude);
                },
                error => {
                    setError('Impossible d’obtenir la position');
                    setLoading(false);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        } catch (err) {
            setError('Erreur de localisation');
            setLoading(false);
        }
    };

    useEffect(() => {
        getLocation();
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
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ImageBackground
            source={{
                uri: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&w=1080&h=1920&fit=max',
            }}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.content}>
                <Text style={styles.city}>{weather.name}</Text>
                <Text style={styles.time}>
                    {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <ShowIcon iconCode={weather.weather[0].icon} size={100} />
                <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
                <Text style={styles.desc}>
                    {weather.weather[0].description.charAt(0).toUpperCase() +
                        weather.weather[0].description.slice(1)}
                </Text>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        marginTop: 120,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        marginHorizontal: 20,
    },
    city: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    time: {
        fontSize: 18,
        color: '#fff',
        marginVertical: 8,
    },
    temp: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
    },
    desc: {
        fontSize: 18,
        fontStyle: 'italic',
        color: '#fff',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
});

export default HomeScreen;
