import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BookListScreen } from './src/screens/BookListScreen';
import { ScannerScreen } from './src/screens/ScannerScreen';
import { BookFormScreen } from './src/screens/BookFormScreen';
import { Book } from './src/types/Book';

// Definición de tipos para la navegación
export type RootStackParamList = {
  BookList: undefined;
  Scanner: undefined;
  BookForm: { book?: Book; scannedISBN?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="BookList"
          screenOptions={{
            headerShown: false, // Ocultamos el header por defecto ya que implementamos headers personalizados
            contentStyle: { backgroundColor: '#F5F7FA' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="BookList" component={BookListScreen} />
          <Stack.Screen 
            name="Scanner" 
            component={ScannerScreen} 
            options={{ 
              animation: 'slide_from_bottom', // Animación diferente para el escáner (modal feel)
              presentation: 'modal'
            }} 
          />
          <Stack.Screen name="BookForm" component={BookFormScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}