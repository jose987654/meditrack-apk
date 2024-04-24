import React, { useState } from 'react';
import MapViewDirections from 'react-native-maps-directions'; // Assuming you're using this library for directions

const SaveRouteComponent = ({ startPoint, destination, GOOGLE_MAPS_APIKEY }) => {
  const [routeData, setRouteData] = useState(null);

  // Function to handle getting the route data
  const handleGetRouteData = () => {
    if (startPoint?.coordinatesData?.[0]?.source && destination?.source) {
      fetchRouteData(startPoint.coordinatesData[0].source, destination.source);
    }
  };

  // Function to fetch route data using Google Maps Directions API
  const fetchRouteData = (origin, destination) => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: 'DRIVING', // You can adjust this based on your needs
        key: GOOGLE_MAPS_APIKEY,
      },
      (result, status) => {
        if (status === 'OK') {
          const route = result.routes[0];
          const distance = route.legs.reduce((total, leg) => total + leg.distance.value, 0);
          setRouteData({
            origin,
            destination,
            distance, // Distance in meters
            route, // Entire route data from Directions API
          });
        } else {
          console.error('Directions request failed due to ' + status);
        }
      }
    );
  };

  // Function to handle saving the route data to the database
  const handleSaveRoute = () => {
    if (routeData) {
      saveToDatabase(routeData); // Save both routeData and distance
      alert('Route saved successfully!');
    } else {
      alert('No route data to save.');
    }
  };

  // Function to save data to the database (You need to implement this)
  const saveToDatabase = (data) => {
    // Implement saving data to your database here
    console.log('Saving data to database:', data);
  };

  return (
    <div>
      {/* Button to get route data */}
      <button onClick={handleGetRouteData}>Get Route Data</button>
      
      {/* Button to save route data */}
      <button onClick={handleSaveRoute}>Save Route</button>
      
      {/* MapViewDirections component to display route */}
      {routeData && (
        <MapViewDirections
          origin={routeData.origin}
          destination={routeData.destination}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="green"
        />
      )}
    </div>
  );
};

export default SaveRouteComponent;
