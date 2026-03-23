// import React, { useEffect, useState } from 'react';
// import { View, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
// import CarCard from '../components/CarCard';
// import { getCars, Car } from '../data/cars';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';

// export default function CarListScreen() {
//   const navigation = useNavigation<any>();
//   const [cars, setCars] = useState<Car[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const loadCars = async () => {
//     try {
//       const data = await getCars();
//       setCars(data);
//       console.log(`Loaded ${data.length} available cars`);
//     } catch (error) {
//       console.error('Error loading cars:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadCars();
//   }, []);

//   // Refresh data every time the screen comes into focus
//   useFocusEffect(
//     React.useCallback(() => {
//       loadCars();
//     }, [])
//   );

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadCars();
//     setRefreshing(false);
//   };

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#000" />
//       </View>
//     );
//   }

//   return (
//     <FlatList
//       data={cars}
//       keyExtractor={(item) => item.id}
//       renderItem={({ item }) => (
//         <CarCard
//           car={item}
//           onRent={() => navigation.navigate('RentCar', { car: item })}
//         />
//       )}
//       contentContainerStyle={{ padding: 10 }}
//       refreshControl={
//         <RefreshControl
//           refreshing={refreshing}
//           onRefresh={onRefresh}
//           colors={['#2196f3']}
//           tintColor="#2196f3"
//         />
//       }
//     />
//   );
// }
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';
import CarCard from '../components/CarCard';
import { getCars, Car } from '../data/cars';

export default function CarListScreen() {
  const navigation = useNavigation<any>();
  const headerHeight = useHeaderHeight();

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ---- Filters ----
  const [showFilter, setShowFilter] = useState(false);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [transmission, setTransmission] = useState<'Any' | 'Automatic' | 'Manual'>('Any');
  const [year, setYear] = useState<string>('Any');

  const hasActiveFilters = useMemo(
    () => minPrice != null || maxPrice != null || transmission !== 'Any' || year !== 'Any',
    [minPrice, maxPrice, transmission, year]
  );

  const loadCars = async () => {
    try {
      const data = await getCars();
      setCars(data);
    } catch (error) {
      console.error('Error loading cars:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCars(); }, []);
  useFocusEffect(React.useCallback(() => { loadCars(); }, []));

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCars();
    setRefreshing(false);
  };

  // ---- Filtering (client-side) ----
  const parsePrice = (price: any) => {
    const n = parseInt(String(price).replace(/[^\d]/g, ''), 10);
    return Number.isFinite(n) ? n : 0;
  };

  const filteredCars = useMemo(() => {
    return cars.filter((c: any) => {
      const p = parsePrice(c.price);
      if (minPrice != null && p < minPrice) return false;
      if (maxPrice != null && p > maxPrice) return false;
      if (transmission !== 'Any' && c.transmission !== transmission) return false;
      if (year !== 'Any' && String(c.year) !== String(year)) return false;
      return true;
    });
  }, [cars, minPrice, maxPrice, transmission, year]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* ABSOLUTE overlay layer που δεν μπλοκάρει το header */}
      <View
        pointerEvents="box-none"
        style={[
          styles.absoluteLayer,
            ]}
      >
        {/* Το ίδιο το κουμπί δέχεται taps */}
        <TouchableOpacity onPress={() => setShowFilter(true)} activeOpacity={0.9} style={styles.fabTouchable}>
          <LinearGradient
            colors={['#0011FF', '#A46FFF']}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={[styles.fab, hasActiveFilters && { shadowOpacity: 0.25 }]}
          >
            <Ionicons name="filter" size={20} color="#fff" />
            {hasActiveFilters && <View style={styles.fabDot} />}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredCars}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CarCard car={item} onRent={() => navigation.navigate('RentCar', { car: item })} />
        )}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 10, paddingTop: 10 /* λίγος χώρος κάτω από το FAB */ }}
        ListEmptyComponent={
          <View style={{ paddingVertical:40, alignItems: 'center' }}>
            <Text style={{ color: '#666' }}>
              {hasActiveFilters ? 'No cars match your filters.' : 'No cars available.'}
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196f3']}
            tintColor="#2196f3"
          />
        }
      />

      {/* FILTER MODAL */}
      <Modal visible={showFilter} transparent animationType="fade" onRequestClose={() => setShowFilter(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Filters</Text>

            {/* Price */}
            <Text style={styles.label}>Price per day (€)</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
              <View style={styles.inputPill}>
                <Text style={styles.pillPrefix}>Min</Text>
                <TextInput
                  style={styles.pillInput}
                  keyboardType="numeric"
                  placeholder="30"
                  placeholderTextColor="#aaa"
                  value={minPrice?.toString() ?? ''}
                  onChangeText={(v) => setMinPrice(v ? Number(v) : null)}
                />
              </View>
              <View style={styles.inputPill}>
                <Text style={styles.pillPrefix}>Max</Text>
                <TextInput
                  style={styles.pillInput}
                  keyboardType="numeric"
                  placeholder="80"
                  placeholderTextColor="#aaa"
                  value={maxPrice?.toString() ?? ''}
                  onChangeText={(v) => setMaxPrice(v ? Number(v) : null)}
                />
              </View>
            </View>

            {/* Transmission (active = gradient) */}
            <Text style={styles.label}>Transmission</Text>
            <View style={styles.chipsRow}>
              {(['Any', 'Automatic', 'Manual'] as const).map((opt) => {
                const active = transmission === opt;
                return (
                  <TouchableOpacity key={opt} onPress={() => setTransmission(opt)} activeOpacity={0.9}>
                    {active ? (
                      <LinearGradient
                        colors={['#0011FF', '#A46FFF']}
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={[styles.chip, styles.chipGrad]}
                      >
                        <Text style={[styles.chipText, { color: '#fff' }]}>{opt}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.chip}>
                        <Text style={styles.chipText}>{opt}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Year (active = gradient) */}
            <Text style={styles.label}>Year</Text>
            <View style={styles.chipsRow}>
              {['Any', '2023', '2021', '2020', '2019', '2018'].map((opt) => {
                const active = year === opt;
                return (
                  <TouchableOpacity key={opt} onPress={() => setYear(opt)} activeOpacity={0.9}>
                    {active ? (
                      <LinearGradient
                        colors={['#0011FF', '#A46FFF']}
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={[styles.chip, styles.chipGrad]}
                      >
                        <Text style={[styles.chipText, { color: '#fff' }]}>{opt}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.chip}>
                        <Text style={styles.chipText}>{opt}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Actions */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#eee' }]}
                onPress={() => {
                  setMinPrice(null);
                  setMaxPrice(null);
                  setTransmission('Any');
                  setYear('Any');
                }}
                activeOpacity={0.9}
              >
                <Text style={{ color: '#111', fontWeight: '700' }}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowFilter(false)} activeOpacity={0.9} style={{ flex: 1 }}>
                <LinearGradient
                  colors={['#0011FF', '#A46FFF']}
                  start={{ x: 1, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={[styles.btn, { backgroundColor: 'transparent' }]}
                >
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Apply</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Overlay layer που δεν μπλοκάρει το header
  absoluteLayer: {
    position: 'absolute',
    top: 12,
    right: 12,
    left: 12, // προαιρετικό, αν θες να το ευθυγραμμίσεις με το περιθώριο της λίστας
    zIndex: 10,
  },
  fabTouchable: {
    alignSelf: 'flex-end', // πάνω δεξιά
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
  },
  fabDot: {
    position: 'absolute',
    right: 3,
    top: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FFAA',
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fafafa',
  },
  chipGrad: { borderWidth: 0 },
  chipText: { color: '#111', fontWeight: '600' },

  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },

  inputPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fafafa',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillPrefix: { color: '#666', fontWeight: '700', marginRight: 6 },
  pillInput: { flex: 1, padding: 0, color: '#111' },
});

