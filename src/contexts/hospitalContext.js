import React, { useState, useEffect, createContext } from 'react';
import { getDocs, collection , query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Import your Firestore instance
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HospitalDataContext = createContext();

export const HospitalDataProvider = ({ children }) => {
  const [hospitalData, setHospitalData] = useState([]);
  const [SamplesData,setSamplesData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const fetchData = async () => {
    const storedEmail = await AsyncStorage.getItem("user");
    const user = JSON.parse(storedEmail);
    let isFirstIteration = true;
  
    const fetchHospitalData = async () => {
      const snapshot = await getDocs(collection(db, 'hospitals'));
      return Promise.all(snapshot.docs.map(async (doc) => {
        const id = doc.id;
        const hospitalData = doc.data();
  
        // Access the subcollections concurrently
        const fetchSamples = getDocs(collection(doc.ref, 'samples'));
        const fetchCoordinates = getDocs(collection(doc.ref, 'coordinates'));
        const [subSnapshot, coordinatesSnapshot] = await Promise.all([fetchSamples, fetchCoordinates]);
  
        const subData = subSnapshot.docs.map(subDoc => ({
          id: subDoc.id,
          ...subDoc.data()
        }));
  
        let coordinatesData = coordinatesSnapshot.docs.map(subDoc => ({
          id: subDoc.id,
          ...subDoc.data()
        }));
  
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
    };
  
    const fetchOrderData = async () => {
      const q = query(
        collection(db, "orders"),
        where("Userid", "==", user.email)
      );
      const querySnapshot = await getDocs(q);
  
      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      return orders;
    };
  
    const [hospitalData, orderData] = await Promise.all([fetchHospitalData(), fetchOrderData()]);
  
    setHospitalData(hospitalData);
    setOrderData(orderData);
  }  
  useEffect(() => {    
    fetchData();
  }, []);
 
  return (
    <HospitalDataContext.Provider value={{hospitalData,SamplesData,fetchData,orderData}}>
      {children}
    </HospitalDataContext.Provider>
  );
};