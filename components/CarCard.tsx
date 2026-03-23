import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Import the 'Car' type from our data file
import { Car } from '../data/cars';
import { LinearGradient } from "expo-linear-gradient";


// Define the type for the props this components will receive
// It expects a single prop named 'car' of type 'Car'
interface CarCardProps {
    car: Car;
    onRent: () => void;
}
  

// This is the CarCard component
// It uses destrucuring to get the 'car' object directly from prps
const CarCard: React.FC<CarCardProps> = ({ car,onRent}) => {
  return (
    <LinearGradient
                    colors={["#0011FF", "#A46FFF"]}
                    start={{ x: 1, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style = {styles.gradientBorder}
                  >
    <View style={styles.cardContainer}>
      <Text style={styles.title}>{car.name}</Text>
      <Image source={{uri: car.image}} style={styles.image} />
      {/* <Text style={styles.infoLink}>More Information</Text> */}
      <View style={styles.bottomRow}>
        <Text style={styles.price}>{car.price} € / day</Text>
        <TouchableOpacity
        // style ={styles.rentButton}
        onPress={onRent}>
          <LinearGradient
                    colors={["#0011FF", "#A46FFF"]}
                    start={{ x: 1, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.rentButton}
                  >
          <Text style = {styles.rental}>Rent</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
    </LinearGradient>
  );
};



// define the styles for te component
const styles = StyleSheet.create({
    gradientBorder: {
      width:'90%',
        padding: 2, // πάχος του “border”
        borderRadius: 22,
        alignItems: "center",
      justifyContent: "center",
      marginVertical: 12,
        marginHorizontal: 20,
    },
    cardContainer: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        // marginVertical: 10,
        // marginHorizontal: 15,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Shadow for Android
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    infoLink: {
        color: '#800080',
        textAlign: 'center',
        marginBottom: 15,
        fontWeight: '500',
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    rentButton: {
      marginTop: 40,
      
      borderRadius: 15,
      paddingHorizontal: 10,
      alignSelf: 'flex-end'
    },
    rental: {
        color: 'white',
        padding: 10,
        fontSize: 18,
        alignSelf: 'center',
    }
});

// Export the component so it can be used in other files
export default CarCard;