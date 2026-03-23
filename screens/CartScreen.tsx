// screens/CartScreen.tsx

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Alert,
  Animated,
  Dimensions,
  Button
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";

interface RentalCar {
  rentalId: number;
  startDate: string;
  endDate: string;
  carId: number;
  name: string;
  price: string; 
  image: string;
  engine: string;
  power: string;
  transmission: string;
  model: string;
  year: string;
}

const CartScreen = () => {
  const navigation = useNavigation();
  const [rentals, setRentals] = useState<RentalCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchRentalHistory();
  }, []);

  // Refresh data every time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchRentalHistory(false); 
    }, [])
  );

  const fetchRentalHistory = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true);
      }
      
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        Alert.alert('Error', 'Please login first');
        return;
      }

      const userData = JSON.parse(userDataString);
      const response = await fetch(`http://10.0.2.2:5000/rental-history/${userData.id}`);
      const data = await response.json();
      
      setRentals(data);
    } catch (error) {
      console.error('Error fetching rental history:', error);
      Alert.alert('Error', 'Failed to load rental history');
    } finally {
      if (showLoadingState) {
        setLoading(false);
      }
    }
  };

  const handlePayment = async (rentalId: number) => {
    try {
      //checkmark animation
      setShowCheckmark(true);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();

      const response = await fetch(`http://10.0.2.2:5000/pay-rental/${rentalId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Remove the paid rental from current cart
        setRentals(prevRentals => prevRentals.filter(rental => rental.rentalId !== rentalId));
      } else {
        throw new Error(result.message || 'Payment failed');
      }

    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    }

    // Hide after 2 seconds
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowCheckmark(false);
      });
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateTotal = (item: RentalCar) => {
    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    let daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // minimo 1 dia
    if (daysDiff <= 0) {
      daysDiff = 1;
    }
    
    // calcular precio por dia
    const pricePerDay = parseInt(item.price) || 50; 
    
    const totalPrice = pricePerDay * daysDiff;
    
    return {
      days: daysDiff,
      pricePerDay: pricePerDay,
      total: totalPrice
    };
  };

  const renderRentalCard = ({ item }: { item: RentalCar }) => (
    <LinearGradient
                        colors={["#0011FF", "#A46FFF"]}
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style = {styles.gradientBorder}
                      >
    <View style={styles.cardContainer}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>{item.year}</Text>
      </View>

      {/* Image Section */}
      <View style={styles.imageSection}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>


      {/* Content Section */}
      <View style={styles.contentSection}>
        {/*Date Section */}
        <View style={styles.simpleDateSection}>
          <Text style={styles.simpleDateText}>
            <Text style={styles.dateLabel}>From: </Text>
            {formatDate(item.startDate)}
          </Text>
          <Text style={styles.simpleDateText}>
            <Text style={styles.dateLabel}>To: </Text>
            {formatDate(item.endDate)}
          </Text>
        </View>

        {/* Price and Payment Section */}
        <View style={styles.paymentSection}>
          <View style={styles.priceContainer}>
            <Text style={styles.totalLine}>
              Total: €{calculateTotal(item).total}
            </Text>
            <Text style={styles.priceBreakdown}>
              €{calculateTotal(item).pricePerDay}/day × {calculateTotal(item).days} days
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => handlePayment(item.rentalId)}
          >
            <LinearGradient
              colors={["#0011FF", "#A46FFF"]}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={styles.payButton}
            >
            <Text style={styles.payButtonText}>Pay Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </LinearGradient>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading your rentals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {rentals.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No active rentals found</Text>
        </View>
      ) : (
        <FlatList
          data={rentals}
          renderItem={renderRentalCard}
          keyExtractor={(item) => item.rentalId.toString()}
          showsVerticalScrollIndicator={false}
          pagingEnabled={true}
          snapToInterval={height * 0.78 + 40}
          snapToAlignment="start"
          decelerationRate="fast"
          contentContainerStyle={styles.listContainer}
          getItemLayout={(data, index) => ({
            length: height * 0.78 + 40,
            offset: (height * 0.78 + 40) * index,
            index,
          })}
        />
      )}

      {/* Checkmark Animation Overlay */}
      {showCheckmark && (
        <View style={styles.overlay}>
          <Animated.View 
            style={[
              styles.checkmarkContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.successText}>Payment Successful!</Text>
          </Animated.View>
        </View>
      )}
    </View>
   
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  gradientBorder: {
      width:'90%',
      padding: 2,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 12,
      marginHorizontal: 20,
    },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flexGrow: 1,
    paddingTop: 10, 
    paddingBottom: 10,
  },
  payButton: {
    borderRadius: 15,
    width: 150,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
  cardContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  imageSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: width * 0.8,
    height: height * 0.25,
    resizeMode: 'contain',
    borderRadius: 15,
  },
  contentSection: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  rentalSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 10,
  },
  simpleDateSection: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  simpleDateText: {
    fontSize: 24,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  dateLabel: {
    fontWeight: 'bold',
    color: '#000',
  },
  paymentSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingBottom: 15,
    marginTop: 5,
    paddingHorizontal: 15,
  },
  priceContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLine: {
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  priceBreakdown: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  checkmark: {
    fontSize: 80,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
  },
});

export default CartScreen;