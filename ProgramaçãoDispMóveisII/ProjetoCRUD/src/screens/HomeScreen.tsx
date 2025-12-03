import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../contexts/AuthContext';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Olá, {user?.name}!
        </Text>
        <Text style={styles.subtitle}>Bem-vinda ao seu app de skincare</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.card, styles.productsCard]}
          onPress={() => navigation.navigate('MyProducts')}
          activeOpacity={0.7}
        >
          <Text style={styles.cardTitle}>Meus Produtos</Text>
          <Text style={styles.cardSubtitle}>Gerencie seus produtos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.routineCard]}
          onPress={() => navigation.navigate('MyRoutine')}
          activeOpacity={0.7}
        >
          <Text style={styles.cardTitle}>Minha Rotina</Text>
          <Text style={styles.cardSubtitle}>Organize sua rotina</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.profileCard]}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.7}
        >
          <Text style={styles.cardTitle}>Perfil</Text>
          <Text style={styles.cardSubtitle}>Suas informações</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: '#FFF5F8',
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D97D96',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 16,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  productsCard: {
    backgroundColor: '#FFE5F0',
    borderLeftWidth: 6,
    borderLeftColor: '#D97D96',
  },
  routineCard: {
    backgroundColor: '#FFF0D4',
    borderLeftWidth: 6,
    borderLeftColor: '#F5A623',
  },
  profileCard: {
    backgroundColor: '#E8F5F9',
    borderLeftWidth: 6,
    borderLeftColor: '#4A90D9',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#999',
  },
});
