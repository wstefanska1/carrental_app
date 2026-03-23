// import React, { useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { Calendar, DateObject } from 'react-native-calendars';

// interface RentCalendarProps {
//   onSelectDates: (startDate: string, endDate: string) => void;
// }

// const RentCalendar = ({onSelectDates}:RentCalendarProps) => {
//   const [startDate, setStartDate] = useState<string | null>(null);
//   const [endDate, setEndDate] = useState<string | null>(null);
//   const [markedDates, setMarkedDates] = useState<any>({});

//   const onDayPress = (day: DateObject) => {
//     const date = day.dateString;

//     if (!startDate || (startDate && endDate)) {
//       setStartDate(date);
//       setEndDate(null);
//       setMarkedDates({ [date]: { startingDay: true, endingDay: true, color: 'blue', textColor: 'white' } });
//       onSelectDates(date, date);
//     } else if (startDate && !endDate) {
//       if (date < startDate) { 
//         setStartDate(date);
//         setEndDate(null);
//         setMarkedDates({ [date]: { startingDay: true, endingDay: true, color: 'blue', textColor: 'white' } });  
//         onSelectDates(date, date);
//       } else {
//         setEndDate(date);
//       }

    
//       const range: any= {};
//       const s = new Date(startDate);
//       const e = new Date(date);
//       for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
//         const ds = d.toISOString().split('T')[0];
//         range[ds] = {
//           color: 'blue',
//           textColor: 'white',
//           startingDay: ds === startDate,
//           endingDay: ds === date,
//         };
//       }
//       setMarkedDates(range);
//       onSelectDates(startDate, date);
//     }
//   };

//   return (
//     <View style={{ marginVertical: 5 }}>
//       <Calendar
//         markingType={'period'}
//         markedDates={markedDates}
//         onDayPress={onDayPress}
//       />
//       <Text style={{ marginTop: 5,
//                      marginBottom: 5,
//                      fontSize: 16, 
//                      textAlign: 'center' ,
//                      color: 'black',
//                      fontWeight: 'bold'
//                     }}>
//         {startDate && `Start Date: ${startDate}`}{'\n'}
//         {endDate && `End Date: ${endDate}`}
//       </Text>
//     </View>
//   );
// };

// export default RentCalendar;

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, DateObject } from 'react-native-calendars';
import { LinearGradient } from "expo-linear-gradient";

interface RentCalendarProps {
  onSelectDates: (startDate: string, endDate: string) => void;
  bookedDates?: string[];
}

const RentCalendar = ({ onSelectDates, bookedDates = [] }: RentCalendarProps) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState<any>({});

  const handleSelect = (dateString: string) => {
      if (bookedDates.includes(dateString)) {
        return;
      }
    if (!startDate || (startDate && endDate)) {
      setStartDate(dateString);
      setEndDate(null);
      setMarkedDates({ [dateString]: true });
      onSelectDates(dateString, dateString);
    } else if (startDate && !endDate) {
      if (dateString < startDate) {
        setStartDate(dateString);
        setEndDate(null);
        setMarkedDates({ [dateString]: true });
        onSelectDates(dateString, dateString);
      } else {
        setEndDate(dateString);
        const range: any = {};
        const s = new Date(startDate);
        const e = new Date(dateString);
        for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
          const ds = d.toISOString().split('T')[0];
          range[ds] = true;
        }
        const allMarked: any = {};

        // Σημείωσε τις κλεισμένες ημερομηνίες
        bookedDates.forEach((d) => {
          allMarked[d] = {
            color: 'lightgrey',
            textColor: 'white',
            disabled: true,
            disableTouchEvent: true,
          };
        });

        // Πρόσθεσε τα “τρέχοντα” επιλεγμένα
        Object.keys(range).forEach((key) => {
          allMarked[key] = {
            color: '#0011FF', // χρώμα gradient placeholder, αν θες μπορείς να το αντικαταστήσεις με gradient dayComponent
            textColor: 'white',
            startingDay: range[key].startingDay,
            endingDay: range[key].endingDay,
          };
        });

        setMarkedDates(allMarked);
        onSelectDates(startDate, dateString);
      }
    }
  };

  return (
  <View style={{ marginVertical: 5 }}>
    <Calendar
      markingType={'period'}
      markedDates={markedDates}
      onDayPress={(day) => {
        const date = day.dateString;
        // Αν η ημερομηνία είναι ήδη booked, αγνόησέ την
        if (bookedDates.includes(date)) return;
        handleSelect(date);
      }}
      dayComponent={({ date, state }) => {
        const isBooked = bookedDates.includes(date.dateString);
        const isSelected = markedDates[date.dateString];

        return (
          <TouchableOpacity
            onPress={() => !isBooked && handleSelect(date.dateString)}
            activeOpacity={0.7}
            style={styles.dayContainer}
          >
            {isBooked ? (
              <View style={styles.bookedCircle}>
                <Text style={styles.bookedText}>{date.day}</Text>
              </View>
            ) : isSelected ? (
              <LinearGradient
                colors={["#0011FF", "#A46FFF"]}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.gradientCircle}
              >
                <Text style={styles.selectedText}>{date.day}</Text>
              </LinearGradient>
            ) : (
              <Text
                style={{
                  color: state === "disabled" ? "gray" : "black",
                  fontWeight: '500',
                }}
              >
                {date.day}
              </Text>
            )}
          </TouchableOpacity>
        );
      }}
    />

    <Text style={styles.infoText}>
      {startDate && `Start Date: ${startDate}`}{'\n'}
      {endDate && `End Date: ${endDate}`}
    </Text>
  </View>
);

};

const styles = StyleSheet.create({
  bookedCircle: {
  width: 34,
  height: 34,
  borderRadius: 17,
  backgroundColor: "lightgrey",
  alignItems: "center",
  justifyContent: "center",
},
bookedText: {
  color: "white",
  fontWeight: "bold",
},
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
  },
  gradientCircle: {
    width: 34,
    height: 34,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  infoText: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
});

export default RentCalendar;

