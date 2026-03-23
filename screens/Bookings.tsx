// screens/Bookings.tsx

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  Alert, 
  Dimensions,
  RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";

interface CompletedRental {
  rentalId: number;
  name: string;
  model: string;
  year: string;
  image: string;
  price: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'paid';
}

const Bookings = () => {
  const [bookings, setBookings] = useState<CompletedRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Refresh data every time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchBookings();
    }, [])
  );

  const fetchBookings = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        Alert.alert('Error', 'Please login first');
        return;
      }

      const userData = JSON.parse(userDataString);
      const response = await fetch(`http://10.0.2.2:5000/bookings/${userData.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateTotal = (item: CompletedRental) => {
    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    let daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff <= 0) {
      daysDiff = 1;
    }
    
    // calcular precio por dia 
    const pricePerDay = parseInt(item.price) || 50; // fallback to 50 si no se puede parsear
    
    const totalPrice = pricePerDay * daysDiff;
    
    return {
      days: daysDiff,
      pricePerDay: pricePerDay,
      total: totalPrice
    };
  };

  const renderBookingCard = ({ item }: { item: CompletedRental }) => (
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

        {/* Total Section */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLine}>
            Total Paid: €{calculateTotal(item).total}
          </Text>
          <Text style={styles.priceBreakdown}>
            €{calculateTotal(item).pricePerDay}/day × {calculateTotal(item).days} days
          </Text>
        </View>
      </View>
    </View>
    </LinearGradient>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading your bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {bookings.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No bookings found</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingCard}
          keyExtractor={(item) => item.rentalId.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
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
    marginBottom: 12,
    marginTop: 5,
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16, 
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  imageSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  image: {
    width: width * 0.7, 
    height: height * 0.15,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  contentSection: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  rentalSection: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  simpleDateSection: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  simpleDateText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  dateLabel: {
    fontWeight: 'bold',
    color: '#000',
  },
  totalSection: {
    alignItems: 'center',
    paddingBottom: 10,
    marginTop: 3,
    paddingHorizontal: 10,
  },
  totalLine: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 3,
  },
  priceBreakdown: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
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
});

export default Bookings;