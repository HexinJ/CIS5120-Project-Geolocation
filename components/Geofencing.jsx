import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { View, StyleSheet, Text, DeviceEventEmitter } from 'react-native';
import { useEffect, useState } from 'react';

const LOCATION_GEOFENCING_TASK = 'LOCATION_GEOFENCING_TASK';

// Define the task that will handle geofencing events
TaskManager.defineTask(
  LOCATION_GEOFENCING_TASK,
  ({ data: { eventType, region }, error }) => {
    if (error) {
      console.error(error);
      return;
    }

    if (eventType === Location.GeofencingEventType.Enter) {
      console.log(`You've entered region: ${region.identifier}`);
      DeviceEventEmitter.emit('geofenceStatus', true);
    } else if (eventType === Location.GeofencingEventType.Exit) {
      console.log(`You've left region: ${region.identifier}`);
      DeviceEventEmitter.emit('geofenceStatus', false);
    }
  },
);

// Start geofencing
async function startGeofencing(regions) {
  // Request permissions
  const { status } = await Location.requestBackgroundPermissionsAsync();

  if (status !== 'granted') {
    console.log('Background location permission not granted');
    return;
  }

  // Start the geofencing task
  await Location.startGeofencingAsync(LOCATION_GEOFENCING_TASK, regions);
  console.log('Geofencing started');
}

// Stop geofencing
async function stopGeofencing() {
  await Location.stopGeofencingAsync(LOCATION_GEOFENCING_TASK);
  console.log('Geofencing stopped');
}

export default function Geofencing() {
  // Define regions to monitor
  const regions = [
    {
      identifier: 'Skirkanich Hall',
      latitude: 39.95218955164862, 
      longitude: -75.18985586173162,
      radius: 30, // meters
      notifyOnEnter: true,
      notifyOnExit: true,
    },
  ];

  const [entered, setEntered] = useState(false)

  useEffect(() => {
    (async () => {
      await startGeofencing(regions);
    })();

    const subscription = DeviceEventEmitter.addListener('geofenceStatus', setEntered);
    return () => subscription.remove();
  }, []);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Geofencing for Skiskanich Hall</Text>

      <View style={styles.card}>
        <Text style={styles.text}>
          Latitude: {regions[0].latitude}
          </Text>
        <Text style={styles.text}>
          Longitude: {regions[0].longitude}
        </Text>
        <Text style={styles.text}>
          Radius: {regions[0].radius} meters
        </Text>
        <Text style={styles.text}>
          Entered: {String(entered)}
        </Text>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
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