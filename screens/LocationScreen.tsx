
// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { StyleSheet, View, ActivityIndicator, Platform, TouchableOpacity, Text } from 'react-native';
// import MapView, { Marker, PROVIDER_GOOGLE, LatLng } from 'react-native-maps';
// import { getCars, Car } from '../data/cars';
// import { LinearGradient } from 'expo-linear-gradient';

// const ODENSE = { latitude: 55.4038, longitude: 10.4024 };

// const LocationScreen = () => {
//   const [cars, setCars] = useState<Car[]>([]);
//   const [loading, setLoading] = useState(true);
//   const mapRef = useRef<MapView>(null);

//   useEffect(() => {
//     (async () => {
//       const all = await getCars();
//       setCars(all);
//       setLoading(false);
//     })();
//   }, []);

//   // Συντεταγμένες όλων των αμαξιών με location
//   const points: LatLng[] = useMemo(
//     () =>
//       cars
//         .filter(c => typeof c.latitude === 'number' && typeof c.longitude === 'number')
//         .map(c => ({ latitude: c.latitude as number, longitude: c.longitude as number })),
//     [cars]
//   );

//   // Αν δεν υπάρχουν σημεία, ξεκινάμε Odense
//   const initialRegion = useMemo(
//     () => ({
//       latitude: ODENSE.latitude,
//       longitude: ODENSE.longitude,
//       latitudeDelta: 0.12,
//       longitudeDelta: 0.12,
//     }),
//     []
//   );

//   // Auto-fit σε όλα τα markers όταν υπάρχουν >1
//   useEffect(() => {
//     if (!mapRef.current) return;
//     if (points.length > 1) {
//       mapRef.current.fitToCoordinates(points, {
//         edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
//         animated: false,
//       });
//     } else if (points.length === 1) {
//       mapRef.current.animateToRegion(
//         { ...points[0], latitudeDelta: 0.05, longitudeDelta: 0.05 },
//         300
//       );
//     }
//   }, [points]);

//   // Βοηθητικό για +/− zoom
//   const adjustZoom = (factor: number) => {
//     if (!mapRef.current) return;
//     // πάρε την τρέχουσα περιοχή (fallback στο initial)
//     const current = (mapRef.current as any).__lastRegion || initialRegion;
//     const next = {
//       ...current,
//       latitudeDelta: Math.max(0.002, current.latitudeDelta * factor),
//       longitudeDelta: Math.max(0.002, current.longitudeDelta * factor),
//     };
//     mapRef.current.animateToRegion(next, 150);
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <MapView
//         ref={mapRef}
//         style={StyleSheet.absoluteFillObject}     // γεμίζει όλη την οθόνη του screen
//         provider={PROVIDER_GOOGLE}
//         mapType="hybrid"
//         initialRegion={initialRegion}
//         // Ενεργοποιημένα gestures/controls για ζουμ
//         zoomEnabled
//         scrollEnabled
//         rotateEnabled
//         pitchEnabled
//         zoomControlEnabled={Platform.OS === 'android'} // native +/− κουμπιά στο Android
//         onRegionChangeComplete={(reg) => {
//           // κρατάμε την τελευταία περιοχή για smooth custom zoom
//           (mapRef.current as any).__lastRegion = reg;
//         }}
//       >
//         {cars.map(car => {
//           if (car.latitude == null || car.longitude == null) return null;
//           return (
//             <Marker
//               key={String(car.id)}
//               coordinate={{ latitude: car.latitude, longitude: car.longitude }}
//               title={car.name}
//               description={car.locationName ?? `${car.year} • ${car.transmission}`}
//             />
//           );
//         })}
//       </MapView>
//     </View>
//   );
// };

// export default LocationScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
// });

// screens/LocationScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
  Modal,
  Text,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, LatLng } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getCars, Car } from '../data/cars';

const ODENSE = { latitude: 55.4038, longitude: 10.4024 };

const LocationScreen = () => {
  const navigation = useNavigation<any>();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      const all = await getCars();
      setCars(all);
      setLoading(false);
    })();
  }, []);

  const points: LatLng[] = useMemo(
    () =>
      cars
        .filter(c => typeof c.latitude === 'number' && typeof c.longitude === 'number')
        .map(c => ({ latitude: c.latitude as number, longitude: c.longitude as number })),
    [cars]
  );

  const initialRegion = useMemo(
    () => ({
      latitude: ODENSE.latitude,
      longitude: ODENSE.longitude,
      latitudeDelta: 0.12,
      longitudeDelta: 0.12,
    }),
    []
  );

  useEffect(() => {
    if (!mapRef.current) return;
    if (points.length > 1) {
      mapRef.current.fitToCoordinates(points, {
        edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
        animated: false,
      });
    } else if (points.length === 1) {
      mapRef.current.animateToRegion(
        { ...points[0], latitudeDelta: 0.05, longitudeDelta: 0.05 },
        300
      );
    }
  }, [points]);

  const openCarModal = (car: Car) => {
    setSelectedCar(car);
    setModalVisible(true);
  };

  const closeCarModal = () => {
    setModalVisible(false);
    setSelectedCar(null);
  };

  const handleRent = () => {
    if (!selectedCar) return;
    // Switch στο tab "CarsList" και άνοιγμα της RentCar με το συγκεκριμένο car
    navigation.navigate('CarsList', {
      screen: 'RentCar',
      params: { car: selectedCar },
    });
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        mapType="hybrid"
        initialRegion={initialRegion}
        zoomEnabled
        scrollEnabled
        rotateEnabled
        pitchEnabled
        zoomControlEnabled={Platform.OS === 'android'}
      >
        {cars.map(car => {
          if (car.latitude == null || car.longitude == null) return null;
          const coord = { latitude: car.latitude, longitude: car.longitude };
          return (
            <Marker
              key={String(car.id)}
              coordinate={coord}
              title={car.name}
              description={car.locationName ?? `${car.year} • ${car.transmission}`}
              onPress={() => openCarModal(car)}
            />
          );
        })}
      </MapView>

      {/* Modal με πληροφορίες αυτοκινήτου + Rent */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeCarModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{selectedCar?.name}</Text>
            {selectedCar?.price != null && (
              <Text style={styles.modalSubtitle}>
                   {`€${selectedCar.price} / day`}
              </Text>
            )}
            {!!selectedCar?.locationName && (
              <Text style={styles.modalLocation}>{selectedCar.locationName}</Text>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={closeCarModal} style={{ flex: 1 }} activeOpacity={0.85}>
                <View style={[styles.btn, styles.btnOutline]}>
                  <Text style={[styles.btnText, styles.btnOutlineText]}>Close</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleRent} style={{ flex: 1 }} activeOpacity={0.9}>
                <LinearGradient
                  colors={['#0011FF', '#A46FFF']}
                  start={{ x: 1, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={[styles.btn]}
                >
                  <Text style={styles.btnText}>Rent</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 6 },
  modalSubtitle: { fontSize: 16, color: '#333', marginBottom: 4 },
  modalLocation: { fontSize: 13, color: '#666', marginBottom: 14 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 6 },

  btn: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  btnText: { color: '#fff', fontWeight: '800' },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: '#A46FFF',
    backgroundColor: 'transparent',
  },
  btnOutlineText: { color: '#6A4DFF' },
});
