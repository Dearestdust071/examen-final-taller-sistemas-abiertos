import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BookListScreen } from './src/screens/BookListScreen';
import { ScannerScreen } from './src/screens/ScannerScreen';
import { BookFormScreen } from './src/screens/BookFormScreen';
import { Book } from './src/types/Book';

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
            headerShown: false,
            contentStyle: { backgroundColor: '#F5F7FA' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="BookList" component={BookListScreen} />
          <Stack.Screen 
            name="Scanner" 
            component={ScannerScreen} 
            options={{ 
              animation: 'slide_from_bottom',
              presentation: 'modal'
            }} 
          />
          <Stack.Screen name="BookForm" component={BookFormScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}