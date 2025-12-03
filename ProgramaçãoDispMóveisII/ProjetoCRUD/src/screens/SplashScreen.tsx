import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export default function SplashScreen({ navigation }: SplashScreenProps) {
  useEffect(() => {
    // Simula carregamento inicial
    const timer = setTimeout(() => {
      navigation.replace('DatabaseSelection');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.decorativeTop} />
      
      <View style={styles.logoContainer}>
        <Text style={styles.title}>SkinCare</Text>
        <Text style={styles.subtitle}>Sua rotina perfeita em um app</Text>
      </View>
      
      <View style={styles.loadingContainer}>
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#D97D96" />
        </View>
        <Text style={styles.loadingText}>Preparando...</Text>
      </View>

      <View style={styles.decorativeBottom} />
      <Text style={styles.footer}>FATEC Votorantim - 2025</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  decorativeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: '#D97D96',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    opacity: 0.1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#D97D96',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  spinnerContainer: {
    backgroundColor: 'rgba(217, 125, 150, 0.1)',
    borderRadius: 60,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#D97D96',
    fontWeight: '600',
  },
  decorativeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: '#D97D96',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    opacity: 0.1,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    fontSize: 13,
    color: '#D97D96',
    fontWeight: '600',
  },
});
