import { StyleSheet, Text, TextInput, Alert, View, Button, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";

export default function ForgotPass() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const changePassword = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5000/updatePassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Password changed successfully');
        navigation.navigate('login');
      } else {
        Alert.alert('Error', 'Incorrect username');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <LinearGradient
      colors={["#0011FF", "#A46FFF"]}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.outerGradientContainer}
    >
      <View style={styles.outerContainerInner}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Change Password</Text>

          <LinearGradient
            colors={["#A46FFF", "#0011FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.inputGradientBorder}
          >
            <View style={styles.inputInner}>
              <TextInput
                placeholder="Enter your username"
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
                placeholder="Enter new password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.inputFieldInner}
              />
            </View>
          </LinearGradient>

          <TouchableOpacity onPress={changePassword} activeOpacity={0.8}>
            <LinearGradient
              colors={["#0011FF", "#A46FFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Change Password</Text>
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

    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,

    elevation: 5,
  },
  outerContainerInner: {
    flex: 1,
    borderRadius: 38,
    backgroundColor: "white",
  },
  innerContainer: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: "center",
    marginTop: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 40,
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
    marginTop: 40,
    width: 200,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  loginButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});
