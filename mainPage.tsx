import { StyleSheet, Text, TextInput, TouchableOpacity, Alert, View, Button } from 'react-native';
import React, { useState } from 'react';
import {useNavigation} from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';



export default function mainPage(){


  return(
      <View style={styles.container}>
    <Text>Car Rent</Text>


       <View style={styles.buttons}>
    <TouchableOpacity style={{flex: 1, alignItems:'center'}}>
      <Ionicons name="person" size={40} color="black" style={{ marginRight: 8 }} />
    </TouchableOpacity>

     <TouchableOpacity style={{flex: 1, alignItems:'center'}}>
          <Ionicons name="car" size={40} color="black" style={{ marginRight: 8 }} />
      </TouchableOpacity>

      <TouchableOpacity style={{flex: 1, alignItems:'center'}}>
                <Ionicons name="cart" size={40} color="black" style={{ marginRight: 8 }} />
      </TouchableOpacity>
      </View>
</View>


  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-around',
      },
  buttons:{
      flexDirection: 'row',
      justifyContent: 'space-around',
      position: 'absolute',
      width:'100%',
      bottom:20,},

});