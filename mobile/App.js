import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { SelectedChildProvider } from './src/context/SelectedChildContext';

import {
    useFonts,
    Quicksand_400Regular,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
} from '@expo-google-fonts/quicksand';

import {
    BeVietnamPro_400Regular,
    BeVietnamPro_700Bold,
} from '@expo-google-fonts/be-vietnam-pro';

export default function App() {

const [fontsLoaded] = useFonts({
    Quicksand_400Regular,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
    BeVietnamPro_400Regular,
    BeVietnamPro_700Bold,
});

if (!fontsLoaded) return null;

  return (
    <SelectedChildProvider>
      <AppNavigator />
    </SelectedChildProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
