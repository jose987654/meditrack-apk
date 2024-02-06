import React, { createContext, useState } from 'react';

export const SelectedHospitalContext = createContext();

export const SelectedHospitalProvider = ({ children }) => {
  const [startPoint, setStartPoint] = useState(null);
  const [destination, setDestination] = useState(null);

  return (
    <SelectedHospitalContext.Provider value={{ startPoint, setStartPoint, destination, setDestination }}>
      {children}
    </SelectedHospitalContext.Provider>
  );
};