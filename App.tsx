import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import login from './login';
import register from './register';
import Home from './Home';
import ForgotPass from './forgotPass';
import CarListScreen from './screens/CarListScreen';
import CartScreen from './screens/CartScreen';
import LocationScreen from './screens/LocationScreen';
import Bookings from './screens/Bookings';
import RentCar from './screens/RentCar';
import UserProfile from './screens/UserProfile';

// Components
import { CustomHeader } from './components/CustomHeader';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const CarStack = createNativeStackNavigator();
const CartStack = createNativeStackNavigator();
const BookingsStack = createNativeStackNavigator();
const LocationStack = createNativeStackNavigator();


const CarStackNavigator = ({navigation: parentNavigation }: any) => {
  return (
    <CarStack.Navigator initialRouteName="CarList">
      <CarStack.Screen
        name="CarList"
        component={CarListScreen}
        options={({ navigation }) => CustomHeader({ title: 'Cars', navigation })}
      />
      <CarStack.Screen
        name="RentCar"
        component={RentCar}
        options={{ title: 'Rent a Car', headerLeft: () => null }}
      />
      <CarStack.Screen
        name="CartScreen"
        component={CartScreen}
        options={({ navigation }) => ({
          title: 'My Cart',
          headerLeft: () => (
            <Button title="Back" onPress={() => navigation.goBack()} />
          ),
          headerRight: () => (
            <Button title="UserProfile" onPress={() => parentNavigation.navigate('UserProfile')} />
          ),
        })}
      />
    </CarStack.Navigator>
  );
};

const CartStackNavigator = ({navigation: parentNavigation }: any) => {
  return (
    <CartStack.Navigator>
      <CartStack.Screen
        name="CartMain"
        component={CartScreen}
        options={({ navigation }) => CustomHeader({ title: 'My Cart', navigation })}
      />
    </CartStack.Navigator>
  );
};

const BookingsStackNavigator = ({navigation: parentNavigation }: any) => {
  return (
    <BookingsStack.Navigator>
      <BookingsStack.Screen
        name="BookingsMain"
        component={Bookings}
        options={({ navigation }) => CustomHeader({ title: 'My Bookings', navigation })}
      />
    </BookingsStack.Navigator>
  );
};

const LocationStackNavigator = ({navigation: parentNavigation }: any) => {
  return (
    <LocationStack.Navigator>
      <LocationStack.Screen
        name="LocationMain"
        component={LocationScreen}
        options={({ navigation }) => CustomHeader({ title: 'Location', navigation })}
      />
    </LocationStack.Navigator>
  );
};

const CarTabs = () => (
  <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6A1B9A',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 70,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="CarsList"
        component={CarStackNavigator}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.navigate('CarsList', { screen: 'CarList' });
             },
          })}
        options={{
          title: 'Cars',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Location"
        component={LocationStackNavigator}
        options={{
          title: 'Location',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartStackNavigator}
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Bookings"
        component={BookingsStackNavigator}
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
);


export default function App() {
  
  return (
    <NavigationContainer>
      
      <Stack.Navigator
        // Options for the entire stack navigator's header
        initialRouteName='Home'
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f8f8f8', // A light background for the header
          },
          headerShadowVisible: false, // Remove the line under the header
        }}
      >

        <Stack.Screen
        name='Home'
        component={Home}
        options={{headerShown:false}
        }
        />
        <Stack.Screen
        name='login'
        component={login}
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Back',
          headerLeft: () => (
            <Ionicons
              name="arrow-back"
              size={26}
              color="black"
              style={{ marginLeft: 10 }}
              onPress={() => {  
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                });
              }}
              />
            ),
          })}
        />  
        <Stack.Screen
        name='register'
        component={register}
        options={{headerShown:true}
        }
        />
        <Stack.Screen
        name='ForgotPass'
        component={ForgotPass}
        options={{headerShown:true}
        }
        />
        
        {/* Main Tabs */}
        <Stack.Screen
          name="CarTabs"
          component={CarTabs}
          options={{ headerShown: false}} // header hidden γιατί κάθε tab έχει δικό του header
        />

        <Stack.Screen
        name='UserProfile'
        component={UserProfile}
        options={{headerShown:false}
        }
        />

      </Stack.Navigator>
    </NavigationContainer>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    marginTop: 10,
    backgroundColor: 'blue',
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  back: {
      color: 'white',
      padding: 10,
      fontSize: 18,
      alignSelf: 'center',
  }
});

