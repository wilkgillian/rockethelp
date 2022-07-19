import { NativeBaseProvider, StatusBar } from 'native-base';
import { THEME } from './src/styles/theme';
import {
  useFonts,
  Roboto_700Bold,
  Roboto_400Regular
} from '@expo-google-fonts/roboto';
import React from 'react';
import { Signin } from './src/screens/Signin';
import { LoadingScreen } from './src/components/Loading';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });
  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {fontsLoaded ? <Signin /> : <LoadingScreen />}
    </NativeBaseProvider>
  );
}