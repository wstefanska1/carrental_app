import { StyleSheet, Text, TextInput, Alert, View, Button, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import {useNavigation} from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';


export default function Home(){

    const navigation = useNavigation();

const loginButton = async () => {
    navigation.navigate('login')
    }

const registerButton = async () => {
    navigation.navigate('register')
    }

  return(
    <View style={styles.outerContainer}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('login')} activeOpacity={0.8}>
                <LinearGradient
                    colors={["#0011FF", "#A46FFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('register')} activeOpacity={0.8}>
                <LinearGradient
                    colors={["#0011FF", "#A46FFF"]}
                    start={{ x: 1, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.buttonGradient}
                >
                    <Text style={styles.buttonText}>Register</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    </View>
  );
}


const styles = StyleSheet.create({
    welcomeText:{
        fontSize: 60,
        fontWeight: 'bold',
        marginBottom: 50,
    },
    outerContainer: {
        width: "90%",
        height: "50%",
        margin: "auto",
        
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',

        borderRadius: 50,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonGradient: {
        width: 120,
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    buttonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    }
});