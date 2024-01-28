import React, { useState, useEffect, createContext } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Import your Firestore instance
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HospitalDataContext = createContext();

export const HospitalDataProvider = ({ children }) => {
  const [hospitalData, setHospitalData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'hospitals'));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      await AsyncStorage.setItem('hospitalData', JSON.stringify(data));
      setHospitalData(data);
    };
    fetchData();
  }, []);

  return (
    <HospitalDataContext.Provider value={hospitalData}>
      {children}
    </HospitalDataContext.Provider>
  );
};