import './global.css';
import { SafeAreaView } from 'react-native-safe-area-context';

import LocationTracking from 'components/LocationTracking';
import Geofencing from 'components/Geofencing';
import { View } from 'react-native';

export default function App() {
  
  return (
    <SafeAreaView className='flex-1 bg-white justify-center items-center'>
      <View className='flex-col items-center justify-center'>

      
      <LocationTracking />
      <Geofencing />
      </View>
    </SafeAreaView>
  );
}
