import React, { useState, useEffect, createContext } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Import your Firestore instance
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HospitalDataContext = createContext();

export const HospitalDataProvider = ({ children }) => {
  const [hospitalData, setHospitalData] = useState([]);
  const [SamplesData,setSamplesData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'hospitals'));
      const data = await Promise.all(snapshot.docs.map(async (doc) => {
        const id = doc.id;
        const hospitalData = doc.data();

        // Access the subcollection
        const subSnapshot = await getDocs(collection(doc.ref, 'samples'));
        const subData = subSnapshot.docs.map(subDoc => ({
          id: subDoc.id,
          ...subDoc.data()
        }));

        // Log the subcollection data
        // console.log("Subcollection data for hospital " + id + ":", subData);

        // If subData is not empty, set it to the samplesData state variable
        if (subData.length > 0) {
          setSamplesData(subData);
        }

        return {
          id,
          ...hospitalData,
          subData // This will add the subcollection data to each hospital
        };
      }));

      await AsyncStorage.setItem('hospitalData', JSON.stringify(data));
      setHospitalData(data);
      // console.log("Hospital data here:", data)
    };
    fetchData();
  }, []);

  return (
    <HospitalDataContext.Provider value={{hospitalData,SamplesData}}>
      {children}
    </HospitalDataContext.Provider>
  );
};