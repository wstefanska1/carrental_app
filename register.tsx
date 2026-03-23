import { StyleSheet, Text, TextInput, Alert, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen() {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [dateOfBirth, setDateBirth] = useState('');
  const [cpr, setCpr] = useState('');

  const register = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name, surname, dateOfBirth, cpr }),
      }); 
      const data = await response.json();
      if (data.success) {
        Alert.alert('Success', 'User registered successfully');
        navigation.navigate('login');
      } else {
        Alert.alert('Error', 'Registration failed');
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
          <Text style={styles.titleText}>Register</Text>

          <LinearGradient colors={["#A46FFF", "#0011FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.inputGradientBorder}>
            <View style={styles.inputInner}>
              <TextInput placeholder="Email" value={username} onChangeText={setUsername} style={styles.inputFieldInner}/>
            </View>
          </LinearGradient>

          <LinearGradient colors={["#A46FFF", "#0011FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.inputGradientBorder}>
            <View style={styles.inputInner}>
              <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputFieldInner}/>
            </View>
          </LinearGradient>

          <LinearGradient colors={["#A46FFF", "#0011FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.inputGradientBorder}>
            <View style={styles.inputInner}>
              <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.inputFieldInner}/>
            </View>
          </LinearGradient>

          <LinearGradient colors={["#A46FFF", "#0011FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.inputGradientBorder}>
            <View style={styles.inputInner}>
              <TextInput placeholder="Surname" value={surname} onChangeText={setSurname} style={styles.inputFieldInner}/>
            </View>
          </LinearGradient>

          <LinearGradient colors={["#A46FFF", "#0011FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.inputGradientBorder}>
            <View style={styles.inputInner}>
              <TextInput placeholder="Date of Birth (dd/mm/yyyy)" value={dateOfBirth} onChangeText={setDateBirth} style={styles.inputFieldInner}/>
            </View>
          </LinearGradient>

          <LinearGradient colors={["#A46FFF", "#0011FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.inputGradientBorder}>
            <View style={styles.inputInner}>
              <TextInput placeholder="CPR" value={cpr} onChangeText={setCpr} style={styles.inputFieldInner}/>
            </View>
          </LinearGradient>

          <TouchableOpacity onPress={register} activeOpacity={0.8}>
            <LinearGradient colors={["#0011FF", "#A46FFF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.registerButton}>
              <Text style={styles.registerButtonText}>Register</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  outerGradientContainer: {
    marginTop: "10%",
    width: "90%",
    height: "90%",
    borderRadius: 40,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 2,
  },
  outerContainerInner: {
    flex: 1,
    borderRadius: 38,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  innerContainer: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: "center",
    marginTop: 30,
  },
  titleText: {
    fontSize: 60,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputGradientBorder: {
    borderRadius: 20,
    padding: 2,
    marginTop: 10,
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
  registerButton: {
    marginTop: 40,
    width: 140,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  registerButtonText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
});
