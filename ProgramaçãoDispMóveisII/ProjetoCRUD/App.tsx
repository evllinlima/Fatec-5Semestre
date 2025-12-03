import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DatabaseProvider } from './src/contexts/DatabaseContext';
import { AuthProvider } from './src/contexts/AuthContext';

import SplashScreen from './src/screens/SplashScreen';
import DatabaseSelectionScreen from './src/screens/DatabaseSelectionScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import MyProductsScreen from './src/screens/MyProductsScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import EditProductScreen from './src/screens/EditProductScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import MyRoutineScreen from './src/screens/MyRoutineScreen';
import AddRoutineStepScreen from './src/screens/AddRoutineStepScreen';
import EditRoutineStepScreen from './src/screens/EditRoutineStepScreen';
import RoutineStepDetailsScreen from './src/screens/RoutineStepDetailsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

export type RootStackParamList = {
  Splash: undefined;
  DatabaseSelection: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  MyProducts: undefined;
  AddProduct: undefined;
  EditProduct: { productId: string | number };
  ProductDetails: { productId: string | number };
  MyRoutine: undefined;
  AddRoutineStep: undefined;
  EditRoutineStep: { stepId: string | number };
  RoutineStepDetails: { stepId: string | number };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator 
              initialRouteName="Splash"
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="DatabaseSelection" component={DatabaseSelectionScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="MyProducts" component={MyProductsScreen} />
              <Stack.Screen name="AddProduct" component={AddProductScreen} />
              <Stack.Screen name="EditProduct" component={EditProductScreen} />
              <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
              <Stack.Screen name="MyRoutine" component={MyRoutineScreen} />
              <Stack.Screen name="AddRoutineStep" component={AddRoutineStepScreen} />
              <Stack.Screen name="EditRoutineStep" component={EditRoutineStepScreen} />
              <Stack.Screen name="RoutineStepDetails" component={RoutineStepDetailsScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="light" />
        </AuthProvider>
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}
