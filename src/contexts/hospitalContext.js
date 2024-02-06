import React, { useState, useEffect, createContext } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Import your Firestore instance
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HospitalDataContext = createContext();

export const HospitalDataProvider = ({ children }) => {
  const [hospitalData, setHospitalData] = useState([]);
  const [SamplesData,setSamplesData] = useState([]);
  const fetchData = async () => {
    const snapshot = await getDocs(collection(db, 'hospitals'));
    let isFirstIteration = true;
    const data = await Promise.all(snapshot.docs.map(async (doc) => {
      const id = doc.id;
      const hospitalData = doc.data();
  
      // Access the subcollection
      const subSnapshot = await getDocs(collection(doc.ref, 'samples'));
      const subData = subSnapshot.docs.map(subDoc => ({
        id: subDoc.id,
        ...subDoc.data()
      }));
      let coordinatesData = null;
      try {
        const coordinatesSnapshot = await getDocs(collection(doc.ref, 'coordinates'));
        coordinatesData = coordinatesSnapshot.docs.map(subDoc => ({
          id: subDoc.id,
          ...subDoc.data()
        }));
        // console.log("Coordinates data for hospital " + id + ":", JSON.stringify(coordinatesData, null, 2));
      } catch (error) {
        console.error("Error fetching 'coordinates' subcollection:", error);
      }
      // If subData is not empty and it's the first iteration, set it to the samplesData state variable
      if (subData.length > 0 && isFirstIteration) {
        setSamplesData(subData);
        isFirstIteration = false;
      }
  
      return {
        id,
        ...hospitalData,
        subData, // This will add the 'samples' subcollection data to each hospital
        coordinatesData // This will add the subcollection data to each hospital
      };
    }));

    // Set the hospitalData state variable with the fetched data
    setHospitalData(data);
  }
  useEffect(() => {    
    fetchData();
  }, []);


  return (
    <HospitalDataContext.Provider value={{hospitalData,SamplesData,fetchData}}>
      {children}
    </HospitalDataContext.Provider>
  );
};