import { RouteProp, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import CarDetails from '../components/CarDetails';
import { Calendar , CalendarProps } from 'react-native-calendars';
import RentCalendar from '../components/RentCalendar';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Modal, View, StyleSheet, ScrollView, Text, Image, TouchableHighlight, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

// for map part
import MapComponent from '../components/MapComponent';


const RentCar = () => {
  const route = useRoute<any>();
  const { car } = route.params;
  const navigation = useNavigation();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [bookedDates, setBookedDates] = useState<string[]>([]);

  useEffect(() => {
  const fetchBookedDates = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:5000/booked-dates/${car.id}`);
      const data = await response.json();
      setBookedDates(data);
    } catch (err) {
      console.error(err);
    }
  };
  fetchBookedDates();
}, [car.id]);
  const handleConfirmRental = async () => {
  if (!startDate || !endDate) {
    alert("Please select both start and end dates for the rental.");
    return;
  }
  const storedUser = await AsyncStorage.getItem('userData');
  const user= storedUser ? JSON.parse(storedUser) : null;

  try {
    const response = await fetch("http://10.0.2.2:5000/rent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate,
        endDate,
        userId: user.id,   //for now, change to current logged user TODO
        carId: car.id,
      }),
    });

    const result = await response.json();

        if (result.success) {
      // Προσθήκη των νέων ημερομηνιών στο state
      const newBooked: string[] = [];
      const s = new Date(startDate);
      const e = new Date(endDate);
      for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
        newBooked.push(d.toISOString().split('T')[0]);
      }
      setBookedDates(prev => [...prev, ...newBooked]);

      setShowSuccessModal(true);
    } else {
      Alert.alert("Error", result.message);
    }
  } catch (err) {
    console.error(err);
    Alert.alert("Error", "Could not connect to the server.");
  }
};

    
  return (
    <ScrollView>
      <LinearGradient
                          colors={["#0011FF", "#A46FFF"]}
                          start={{ x: 1, y: 1 }}
                          end={{ x: 0, y: 0 }}
                          style = {styles.gradientBorder}
                        >
        <View style={styles.cardContainer}>
            <Text style={styles.title}>{car.name}</Text>
            <View style={styles.imageWrap}>
              <Image source={{ uri: car.image }} style={styles.carImage} />
            </View>


            <View style={styles.bottomRow}>
                <Text style={styles.price}>{car.price} € / day</Text>
                <TouchableOpacity onPress={() => setShowDetails(true)}>
                  <LinearGradient
                    colors={["#0011FF", "#A46FFF"]}
                    start={{ x: 1, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.detailsButton}
                  >
                    <Text style={styles.detailsButtonText}>Show Details</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
            </View>

            {/* Add this empty View for spacing */}
            <View style={{ height: 40 }} /> 

            {/* Map section */}
            <View style={styles.mapContainer}>
              <MapComponent cars={[car]} height={200} />
            </View>

            <RentCalendar
            bookedDates={bookedDates}
            onSelectDates={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }} />

            <TouchableOpacity onPress={handleConfirmRental} activeOpacity={0.7}>
              <LinearGradient
                colors={["#0011FF", "#A46FFF"]}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.rentButton}
              >
                <Text style={styles.rental}>Confirm Rental</Text>
              </LinearGradient>
            </TouchableOpacity>
        </View>
        </LinearGradient>
        <Modal
          visible={showDetails}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowDetails(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{car.name} Details</Text>
              <CarDetails car={car} />

              <TouchableOpacity onPress={() => setShowDetails(false)}>
                <LinearGradient
                  colors={["#0011FF", "#A46FFF"]}
                  start={{ x: 1, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal 
        visible={showSuccessModal}
        transparent={true}
        animationType="slide">
          <View style = {styles.modal}>
            <View style = {styles.content}>
              <View style ={{flexDirection: 'row',width: '100%', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20
              }}>
                <TouchableOpacity
                  style ={styles.cross}
                  onPress={() => 
                  setShowSuccessModal(false)
                  }>
                    <Ionicons style ={{
                      marginTop:11
                    }} name="close-circle" size={32} color="#black" />
                </TouchableOpacity>
                <Text style = {styles.header}>Rental Confirmed!</Text>
              </View>
              <Text style = {styles.text} >You have successfully rented the {car.name} from {startDate} to {endDate}.</Text>
              <TouchableOpacity
              style ={styles.modalButton}
              onPress={
                () => {
                  setShowSuccessModal(false);
                  // navegar al carrito, dos niveles
                  const tabNav = navigation.getParent()?.getParent();
                  (tabNav as any).reset({
                    index: 0,
                    routes: [{ name: 'CarTabs', params: { screen: 'Cart' } }],
                  });
                }}>
                <LinearGradient
                                      colors={["#0011FF", "#A46FFF"]}
                                      start={{ x: 1, y: 1 }}
                                      end={{ x: 0, y: 0 }}
                                      style={styles.rentButton}
                                    >
                  <Text style = {styles.rental}>Go to Cart</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  imageWrap: {
  width: '100%',
  aspectRatio: 16 / 9,      // κράτα 16:9 πλαίσιο (μπορείς να το αλλάξεις)
  borderRadius: 12,
  backgroundColor: 'white',
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 10,
},
carImage: {
  width: '100%',
  height: '100%',
  resizeMode: 'contain',    // ΔΕΝ κόβει την εικόνα
},
modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",
},
modalContainer: {
  backgroundColor: "white",
  borderRadius: 20,
  padding: 20,
  width: "85%",
  maxHeight: "80%",
},
modalTitle: {
  fontSize: 18,
  fontWeight: "bold",
  color: "black",
  textAlign: "center",
  marginBottom: 15,
},
closeButton: {
  marginTop: 15,
  borderRadius: 20,
  paddingVertical: 10,
},
closeButtonText: {
  color: "white",
  textAlign: "center",
  fontWeight: "600",
},
    detailsButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  detailsButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  gradientBorder: {
      width:'90%',
        padding: 2, 
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 12,
        marginHorizontal: 20,
  },
    cardContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
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
    details: {
        fontSize: 20,
        color: 'blue',
        textDecorationLine: 'underline',
    },
    rentButton: {
        borderRadius: 15,
        width: 150,
        alignSelf: 'flex-end'
    },
    rental: {
        color: 'white',
        padding: 10,
        fontSize: 18,
        alignSelf: 'center',
    },

    // map section
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 20,
    },
    mapContainer: {
      height: 200,
      width: '100%',
      borderRadius: 15,
      overflow: 'hidden',
      marginBottom: 20,
    },
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '85%',
      backgroundColor: 'white',
      borderRadius: 20,
      paddingTop: 10,
      paddingRight: 20,
      paddingLeft: 20,
      paddingBottom: 20,
      alignItems: 'center'
    },
    modalButton: {
      marginTop: 30,
      borderRadius: 15,
      paddingHorizontal: 10,
      alignSelf: 'flex-end'
    },
    header: {
      position: 'absolute',
      left: '50%',
      transform: [{ translateX: '-50%' }],
      fontSize: 22,
      marginTop: 10,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    text: {
      fontSize: 18,
      textAlign: 'center'
    },
    cross: {
      alignSelf: 'flex-start',
    },
    backButton: {
      color: 'red',
      alignSelf: 'flex-start',  
      fontSize: 30,
    }
});
export default RentCar;