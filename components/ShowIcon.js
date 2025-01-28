import React from 'react';
import { Image, StyleSheet } from 'react-native';

const ShowIcon = ({ iconCode, size = 100 }) => {
    if (!iconCode) return null;

    return (
        <Image
            style={[styles.icon, { width: size, height: size }]}
            source={{
                uri: `https://openweathermap.org/img/wn/${iconCode}@4x.png`,
            }}
        />
    );
};

const styles = StyleSheet.create({
    icon: {
        marginVertical: 8,
    },
});

export default ShowIcon;
