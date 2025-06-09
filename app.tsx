// filepath: c:\Users\Emiliano\Desktop\PiensaRapido\App.tsx
import { useFonts, RobotoSlab_700Bold, RobotoSlab_900Black} from '@expo-google-fonts/roboto-slab';
import { Slot } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    RobotoSlab_700Bold,
    RobotoSlab_900Black,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#723FEB" />
      </View>
    );
  }

  return <Slot />;
}