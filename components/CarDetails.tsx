import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { Car } from '../data/cars';


interface CarDetailsProps {
    car: Car;
}

const CarDetails = ({ car }: CarDetailsProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Model: {car.model}</Text>
            <Text style={styles.title}>Year: {car.year}</Text>
            <Text style={styles.title}>Engine: {car.engine}</Text>
            <Text style={styles.title}>Power: {car.power}</Text>
            <Text style={styles.title}>Transmission: {car.transmission}</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        marginTop: 20,
        alignItems: 'flex-start',
    },
    title: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default CarDetails;