import { StyleSheet, Text, TextInput, Alert, View, Button, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import {useNavigation} from '@react-navigation/native'; 
import { LinearGradient } from "expo-linear-gradient";

import AsyncStorage from '@react-native-async-storage/async-storage';


interface LoginScreenProps {
  username: string | null; 
  password: string | null;
  login: (username: string, password: string) => void;
}


export default function LoginScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginFunction = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {

        await AsyncStorage.setItem('userData', JSON.stringify(data.user)); //store the user for renting
        navigation.navigate('CarTabs');
        

      } else {
        Alert.alert('Error', 'Incorrect username or password');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  }

  return (
    <LinearGradient
      colors={["#0011FF", "#A46FFF"]}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.outerGradientContainer}
    >
      <View style={styles.outerContainerInner}>
        <View style={styles.innerContainer}>
          <Text style={styles.loginText}>Login</Text>

          <LinearGradient
            colors={["#A46FFF", "#0011FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.inputGradientBorder}
          >
            <View style={styles.inputInner}>
              <TextInput
                placeholder="Email"
                value={username}
                onChangeText={setUsername}
                style={styles.inputFieldInner}
              />
            </View>
          </LinearGradient>

          <LinearGradient
            colors={["#A46FFF", "#0011FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.inputGradientBorder}
          >
            <View style={styles.inputInner}>
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.inputFieldInner}
              />
            </View>
          </LinearGradient>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPass')} activeOpacity={0.8} >
              <LinearGradient
              colors={["#0011FF", "#A46FFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.forgetButton}
            >
              <Text style={styles.forgotPassword}>Forgot Password</Text>   
            </LinearGradient>
            </TouchableOpacity>

            

          

          <TouchableOpacity onPress={loginFunction} activeOpacity={0.8}>
            <LinearGradient
              colors={["#0011FF", "#A46FFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Login</Text>   
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  outerGradientContainer: {
    marginTop: "25%",
    width: "90%",
    height: "70%",
    borderRadius: 40,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 2,
  },
  outerContainerInner: {
    flex: 1,
    borderRadius: 38,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  innerContainer: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: "center",
    marginTop: 50,  
  },
  loginText: {
    fontSize: 60,
    fontWeight: "bold",
    marginBottom: 50,
  },
  inputGradientBorder: {
    borderRadius: 20,
    padding: 2,
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
  },
  inputInner: {
    borderRadius: 18,
    backgroundColor: "#f8f8f8",
  },
  inputFieldInner: {
    height: 50,
    paddingLeft: 15,
    fontSize: 16,
  },
  loginButton: {
    marginTop: 30,
    width: 120,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  loginButtonText: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
  },
  forgotPassword: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  forgetButton: {
    marginTop: 20,
    width: 160,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
});