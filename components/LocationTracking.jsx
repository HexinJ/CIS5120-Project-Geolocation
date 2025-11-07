import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

export default function LocationTracking() {
  const [position, setPosition] = useState(null);
  const [subscription, setSubscription] = useState(null);

  // Start location tracking
  const startLocationTracking = async () => {
    // Request permissions
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    // Set up the location subscription
    const locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000, // Update every 3 seconds
        distanceInterval: 10, // Update if moved by 10 meters
      },
      (newLocation) => {
        setPosition(newLocation);
      },
    );

    setSubscription(locationSubscription);
  };

  // Stop location tracking
  const stopLocationTracking = () => {
    subscription?.remove();
    setSubscription(null);
  };

  // Start tracking when component mounts
  useEffect(() => {
    startLocationTracking();

    // Clean up subscription on unmount
    return () => {
      stopLocationTracking();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Tracking Demo</Text>

      {position ? (
        <View style={styles.card}>
          <Text style={styles.text}>Current Latitude: {position.coords.latitude}</Text>
          <Text style={styles.text}>
            Current Longitude: {position.coords.longitude}
          </Text>
          <Text style={styles.text}>Speed: {position.coords.speed}</Text>
          <Text style={styles.text}>
            Timestamp: {new Date(position.timestamp).toLocaleString()}
          </Text>
        </View>
      ) : (
        <Text>Waiting for location updates...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'col',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    justifyContent: 'center', // vertically center content
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});