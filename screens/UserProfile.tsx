// // import React, { useEffect, useState } from 'react';
// // import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { getUser, User } from '../data/user';
// // import { useNavigation } from '@react-navigation/native';
// // import { Ionicons } from '@expo/vector-icons';

// // const UserProfile = () => {
// //   const navigation = useNavigation();
// //   const [user, setUser] = useState<User | null>(null);
// //   const [loading, setLoading] = useState(true);

// //   const getUserInfo = async () => {
// //     const storedUser = await AsyncStorage.getItem('userData');
// //     const parsedUser = storedUser ? JSON.parse(storedUser) : null;

// //     if (parsedUser?.email) {
// //       const userInfo = await getUser(parsedUser.email);
// //       setUser(userInfo);
// //     }
// //     setLoading(false);
// //   };

// //   useEffect(() => {
// //     getUserInfo();
// //   }, []);

// //   if (loading) {
// //     return (
// //       <View style={styles.loadingContainer}>
// //         <Text style={styles.loadingText}>Loading...</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <ScrollView contentContainerStyle={styles.container}>
// //       {/* Back button */}
// //       <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
// //         <Ionicons name="arrow-back" size={28} color="black" />
// //       </TouchableOpacity>

// //       {/* Profile card */}
// //       <View style={styles.card}>
// //         <Text style={styles.header}>User Profile</Text>
// //         <View style={styles.infoRow}>
// //           <Text style={styles.label}>Email:</Text>
// //           <Text style={styles.value}>{user?.email}</Text>
// //         </View>
// //         <View style={styles.infoRow}>
// //           <Text style={styles.label}>Name:</Text>
// //           <Text style={styles.value}>{user?.name}</Text>
// //         </View>
// //         <View style={styles.infoRow}>
// //           <Text style={styles.label}>Surname:</Text>
// //           <Text style={styles.value}>{user?.surname}</Text>
// //         </View>
// //         <View style={styles.infoRow}>
// //           <Text style={styles.label}>Date of Birth:</Text>
// //           <Text style={styles.value}>{user?.dateOfBirth}</Text>
// //         </View>
// //         <View style={styles.infoRow}>
// //           <Text style={styles.label}>CPR:</Text>
// //           <Text style={styles.value}>{user?.cpr}</Text>
// //         </View>
// //       </View>
// //     </ScrollView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     padding: 20,
// //     alignItems: 'center',
// //     backgroundColor: '#f4f4f4',
// //     minHeight: '100%',
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   loadingText: {
// //     fontSize: 18,
// //     color: '#666',
// //   },
// //   backButton: {
// //     alignSelf: 'flex-start',
// //     padding: 8,
// //     borderRadius: 8,
// //     marginBottom: 10,
// //   },
// //   card: {
// //     width: '100%',
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     padding: 20,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 6,
// //     elevation: 8,
// //   },
// //   header: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     marginBottom: 20,
// //     color: 'blue',
// //     textAlign: 'center',
// //   },
// //   infoRow: {
// //     flexDirection: 'row',
// //     marginBottom: 12,
// //   },
// //   label: {
// //     fontWeight: 'bold',
// //     flex: 1,
// //     color: '#333',
// //   },
// //   value: {
// //     flex: 2,
// //     color: '#555',
// //   },
// // });

// // export default UserProfile;


// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getUser, User } from '../data/user';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';

// const UserProfile = () => {
//   const navigation = useNavigation();
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Editable fields
//   const [name, setName] = useState('');
//   const [surname, setSurname] = useState('');
//   const [email, setEmail] = useState('');

//   const getUserInfo = async () => {
//     const storedUser = await AsyncStorage.getItem('userData');
//     const parsedUser = storedUser ? JSON.parse(storedUser) : null;

//     if (parsedUser?.email) {
//       const userInfo = await getUser(parsedUser.email);
//       setUser(userInfo);
//       setName(userInfo.name);
//       setSurname(userInfo.surname);
//       setEmail(userInfo.email);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     getUserInfo();
//   }, []);

//   const handleSave = async () => {
//     if (!name || !surname || !email) {
//       Alert.alert('Error', 'Please fill all fields');
//       return;
//     }

//     try {
//       const storedUser = await AsyncStorage.getItem('userData');
//       const userData = storedUser ? JSON.parse(storedUser) : null;

//       const response = await fetch('http://10.0.2.2:5000/user/update', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           id: userData.id,
//           name,
//           surname,
//           email,
//         }),
//       });

//       const result = await response.json();

//       if (result.success) {
//         Alert.alert('Success', 'Profile updated successfully!');
//         const updatedUser = { ...userData, name, surname, email };
//         await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
//         setUser(updatedUser);
//       } else {
//         Alert.alert('Error', result.message);
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Could not connect to the server.');
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text style={styles.loadingText}>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//         <Ionicons name="arrow-back" size={28} color="black" />
//       </TouchableOpacity>

//       <View style={styles.card}>
//         <Text style={styles.header}>User Profile</Text>

//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Email:</Text>
//           <TextInput
//             style={styles.input}
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//           />
//         </View>

//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Name:</Text>
//           <TextInput style={styles.input} value={name} onChangeText={setName} />
//         </View>

//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Surname:</Text>
//           <TextInput style={styles.input} value={surname} onChangeText={setSurname} />
//         </View>

//         <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//           <Text style={styles.saveText}>Save</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container:  { 
//     padding: 20, 
//     alignItems: 'center', 
//     backgroundColor: '#f4f4f4', 
//     minHeight: '100%' 
//   },
//   loadingContainer: { 
//     flex: 1, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   loadingText: { 
//     fontSize: 18, 
//     color: '#666' 
//   },
//   backButton: { 
//     alignSelf: 'flex-start', 
//     padding: 8, 
//     borderRadius: 8, 
//     marginBottom: 10 
//   },
//   card: { 
//     width: '100%', 
//     backgroundColor: '#fff', 
//     borderRadius: 16, 
//     padding: 20, 
//     shadowColor: '#000', 
//     shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 8 
//   },
//   header: { 
//     fontSize: 24, 
//     fontWeight: 'bold', 
//     marginBottom: 20, 
//     color: 'blue', 
//     textAlign: 'center' 
//   },
//   infoRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     marginBottom: 12 
//   },
//   label: { 
//     fontWeight: 'bold', 
//     flex: 1, 
//     color: '#333'
//  },
//   input: { 
//     flex: 2, 
//     borderWidth: 1, 
//     borderColor: '#ccc', 
//     borderRadius: 8, 
//     padding: 8, 
//     color: '#000' 
//   },
//   saveButton: { 
//     marginTop: 20, 
//     backgroundColor: 'blue', 
//     borderRadius: 10, 
//     paddingVertical: 12, 
//     width: '100%' 
//   },
//   saveText: { 
//     color: 'white', 
//     textAlign: 'center', 
//     fontWeight: 'bold', 
//     fontSize: 16 
//   },
// });

// export default UserProfile;
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

// Αν έχεις ήδη αυτό το helper, κράτα το import σου:
import { getUser, User as ApiUser } from '../data/user';

type User = {
  id: number | string;
  name: string;
  surname: string;
  email: string;
};

const getBaseUrl = () => {
  // Android emulator: 10.0.2.2, iOS simulator: localhost
  if (Platform.OS === 'ios') return 'http://localhost:5000';
  return 'http://10.0.2.2:5000';
};
const BASE_URL = getBaseUrl();

const UserProfile = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [original, setOriginal] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', surname: '', email: '' });

  // 1) Πάρε email από AsyncStorage
  // 2) Φέρε name/surname από backend με getUser(email)
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('userData');
        const parsed: Partial<User> | null = stored ? JSON.parse(stored) : null;
        const email = parsed?.email ?? '';

        if (!email) {
          setLoading(false);
          Alert.alert('Error', 'No email found for the current user.');
          return;
        }

        // Δείξε προσωρινά το email
        setForm(f => ({ ...f, email }));

        // Φέρνουμε τα στοιχεία που αντιστοιχούν στο email
        const userInfo: ApiUser = await getUser(email);
        const merged: User = {
          id: (userInfo as any).id ?? parsed?.id ?? '',
          name: userInfo.name ?? '',
          surname: userInfo.surname ?? '',
          email: userInfo.email ?? email,
        };

        setOriginal(merged);
        setForm({ name: merged.name, surname: merged.surname, email: merged.email });

        // Προαιρετικά: Αν θες να ευθυγραμμίσεις το AsyncStorage με τα φρέσκα
        const currentStored = stored ? JSON.parse(stored) : {};
        const nextStored = { ...currentStored, ...merged };
        await AsyncStorage.setItem('userData', JSON.stringify(nextStored));
      } catch (e) {
        console.error(e);
        Alert.alert('Error', 'Failed to load user profile.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const dirty = useMemo(() => {
    if (!original) return false;
    return original.name !== form.name || original.surname !== form.surname;
  }, [original, form]);

  const onChange = (key: 'name' | 'surname', value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const validate = () => {
    if (!form.name.trim() || !form.surname.trim()) {
      Alert.alert('Check fields', 'Name και Surname είναι υποχρεωτικά.');
      return false;
    }
    return true;
  };

  const onSave = async () => {
    if (!original) return;
    if (!validate()) return;
    if (!dirty) {
      setEditing(false);
      return;
    }

    try {
      setSaving(true);
      // Ενημέρωση backend με id (ή με email αν έτσι το έχεις στον server)
      const res = await fetch(`${BASE_URL}/user/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: original.id,
          name: form.name.trim(),
          surname: form.surname.trim(),
          email: original.email, // το email δεν αλλάζει εδώ
        }),
      });
      const result = await res.json();
      if (!res.ok || result?.success === false) {
        throw new Error(result?.message || `HTTP ${res.status}`);
      }

      // Ενημέρωσε άμεσα UI + AsyncStorage ώστε να φαίνονται οι αλλαγές
      const updated: User = { ...original, name: form.name.trim(), surname: form.surname.trim() };
      setOriginal(updated);
      await AsyncStorage.setItem('userData', JSON.stringify(updated));
      setEditing(false);
      Alert.alert('Saved', 'Profile updated successfully!');
    } catch (e: any) {
      console.error(e);
      Alert.alert('Error', e?.message || 'Could not connect to the server.');
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    if (!original) return;
    setForm({ name: original.name, surname: original.surname, email: original.email });
    setEditing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading profile…</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#0011FF', '#A46FFF']}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.headerCard}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          {!editing ? (
            <TouchableOpacity style={styles.iconBtn} onPress={() => setEditing(true)}>
              <Ionicons name="create-outline" size={22} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                style={[styles.pillBtn, { backgroundColor: 'rgba(255,255,255,0.3)' }]}
                onPress={onCancel}
              >
                <Text style={styles.pillText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pillBtn, { opacity: dirty ? 1 : 0.6 }]}
                disabled={!dirty || saving}
                onPress={onSave}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.pillText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>
          <Text style={styles.displayName}>
            {form.name || '—'} {form.surname || ''}
          </Text>
          <Text style={styles.displaySub}>{form.email || '—'}</Text>
        </View>
      </LinearGradient>

      {/* Card: Email (read-only), Name, Surname */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal info</Text>

        <Field
          label="Email"
          icon="mail"
          value={form.email}
          editable={false} // το email δεν αλλάζει εδώ
          onChangeText={() => {}}
          keyboardType="email-address"
        />

        <Field
          label="Name"
          icon="person"
          value={form.name}
          editable={editing}
          onChangeText={v => onChange('name', v)}
          placeholder="Your name"
        />

        <Field
          label="Surname"
          icon="person-circle"
          value={form.surname}
          editable={editing}
          onChangeText={v => onChange('surname', v)}
          placeholder="Your surname"
        />
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

const Field = ({
  label,
  icon,
  value,
  editable,
  onChangeText,
  keyboardType,
  placeholder,
}: {
  label: string;
  icon: any;
  value: string;
  editable: boolean;
  onChangeText: (v: string) => void;
  keyboardType?: 'default' | 'email-address';
  placeholder?: string;
}) => {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <Ionicons name={icon} size={18} color="#666" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          value={value}
          editable={editable}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16, backgroundColor: '#f7f7fb', minHeight: '100%' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 8, color: '#666' },

  headerCard: { borderRadius: 20, padding: 16, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBtn: { backgroundColor: 'rgba(255,255,255,0.25)', padding: 8, borderRadius: 10 },

  avatarWrap: { alignItems: 'center', marginTop: 12 },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center', justifyContent: 'center'
  },
  displayName: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 10 },
  displaySub: { color: 'rgba(255,255,255,0.9)', marginTop: 4 },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 }, elevation: 2
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#111' },

  label: { fontWeight: '600', marginBottom: 6, color: '#333' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#fafafa'
  },
  input: { padding: 0, color: '#111' },

  pillBtn: { backgroundColor: 'rgba(255,255,255,0.35)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  pillText: { color: '#fff', fontWeight: '700' },
});

export default UserProfile;
