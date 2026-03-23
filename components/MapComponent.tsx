// import React from 'react';
// import { StyleSheet, View } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';

// const MapComponent = () => {
//     return (
//         <MapView
//           style={styles.map}
//           mapType='hybrid'
//           initialRegion={{
//             latitude: 55.3685,
//             longitude: 10.4275,
//             latitudeDelta: 0.02,
//             longitudeDelta: 0.02,
//           }}
//         >
//             <Marker
//               coordinate={{ latitude: 55.362, longitude: 10.4275 }}
//               title='Car Rental Location'
//               description='Pick up your rental car here'
//             />
//         </MapView>
//     )
// }

// const styles = StyleSheet.create({
//     map: {
//         ...StyleSheet.absoluteFillObject, // this makes the map fill its container
//     },
// });

// export default MapComponent;
// components/MapComponent.tsx
import React, { useMemo, useRef, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE, LatLng } from 'react-native-maps';

// Ελάχιστο interface για να μη χρειάζεται import του πλήρους Car type
export type MinimalCar = {
  id: string | number;
  name: string;
  year?: number | string;
  transmission?: string;
  locationName?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type Props = {
  cars: MinimalCar[];   // λίστα αμαξιών (ή ένα μόνο: [car])
  height?: number;      // ύψος χάρτη (default 200)
  mapType?: 'standard' | 'satellite' | 'hybrid' | 'terrain' | 'mutedStandard';
  defaultCenter?: { latitude: number; longitude: number }; // π.χ. Odense
};

const MapComponent: React.FC<Props> = ({
  cars,
  height = 200,
  mapType = 'hybrid',
  defaultCenter = { latitude: 55.4038, longitude: 10.4024 } // Odense
}) => {
  const mapRef = useRef<MapView>(null);

  const points: LatLng[] = useMemo(
    () =>
      cars
        .filter(c => typeof c.latitude === 'number' && typeof c.longitude === 'number')
        .map(c => ({ latitude: c.latitude as number, longitude: c.longitude as number })),
    [cars]
  );

  const initialRegion = useMemo(() => {
    // Αν υπάρχει 1+ marker, ξεκίνα από τον πρώτο. Αλλιώς Odense.
    const lat = points[0]?.latitude ?? defaultCenter.latitude;
    const lng = points[0]?.longitude ?? defaultCenter.longitude;
    return {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.12,
      longitudeDelta: 0.12,
    };
  }, [points, defaultCenter]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Αν 1 σημείο: κεντράρισε πάνω του με λίγο zoom
    if (points.length === 1) {
      mapRef.current.animateToRegion(
        {
          latitude: points[0].latitude,
          longitude: points[0].longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        300
      );
    }

    // Αν >1 σημεία: κάνε fit ώστε να χωράνε όλα
    if (points.length > 1) {
      mapRef.current.fitToCoordinates(points, {
        edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
        animated: false,
      });
    }
  }, [points]);

  return (
  <View style={{ height }}>
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      provider={PROVIDER_GOOGLE}
      mapType={mapType}
      initialRegion={initialRegion}
      zoomEnabled
      scrollEnabled
      rotateEnabled
      pitchEnabled
      zoomControlEnabled={Platform.OS === 'android'} // ← native +/− στο Android όπως στο LocationScreen
      onRegionChangeComplete={(reg) => {
        (mapRef.current as any).__lastRegion = reg;
      }}
    >
      {cars.map((car) => {
        if (car.latitude == null || car.longitude == null) return null;
        return (
          <Marker
            key={String(car.id)}
            coordinate={{ latitude: car.latitude, longitude: car.longitude }}
            title={car.name}
            description={
              car.locationName ?? (car.year ? `${car.year} • ${car.transmission ?? ''}` : undefined)
            }
          >
            <Callout>
              <View style={{ maxWidth: 220 }} />
            </Callout>
          </Marker>
        );
      })}
    </MapView>
  </View>
);
};

export default MapComponent;
