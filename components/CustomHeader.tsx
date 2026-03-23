import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";

export const CustomHeader = ({ title, navigation }: { title: string; navigation: any }) => ({
  title: title,
  headerTitleAlign: 'center' as const,
  headerTitleStyle: { fontSize: 22, fontWeight: 'bold' as const },
  headerLeft: () => (
     
    <TouchableOpacity
      onPress={async () => {
        await AsyncStorage.removeItem('user');
        navigation.reset({
          index: 0,
          routes: [{ name: 'login' }],
        });
      }}
    >
      <LinearGradient
          colors={["#0011FF", "#A46FFF"]}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={{marginLeft: 10,
            paddingHorizontal: 12,
            paddingVertical: 6,
            // backgroundColor: 'black',
            borderRadius: 8}}
            >
      <Text style = {{color: 'white',
                    fontWeight: "bold",
                    fontSize:16}}>Logout</Text>
      </LinearGradient>
    </TouchableOpacity>
  ),
  headerRight: () => (
    <TouchableOpacity
      onPress={() => navigation.navigate('UserProfile')}>
        <Ionicons
          name="person-circle-outline"
          size={32}
          color="black"
          style={{ marginRight: 10 }}
        />
    </TouchableOpacity>
  ),
});