import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useDatabase } from '../contexts/DatabaseContext';
import { skincareAPI } from '../services/apiClient';

type DatabaseSelectionScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DatabaseSelection'>;
};

export default function DatabaseSelectionScreen({ navigation }: DatabaseSelectionScreenProps) {
  const { setDatabaseType } = useDatabase();

  const handleSelectDatabase = (type: 'sqlite' | 'mongodb') => {
    setDatabaseType(type);
    // informar o singleton do cliente para rotear requisições
    skincareAPI.setUseLocalDB(type === 'sqlite');
    
    const dbName = type === 'sqlite' ? 'SQLite (Local)' : 'MongoDB (Online)';
    Alert.alert(
      'Banco Selecionado',
      `Você selecionou ${dbName}`,
      [
        {
          text: 'Continuar',
          onPress: () => navigation.replace('Login'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.decorativeHeader} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Escolha seu Banco</Text>
        <Text style={styles.subtitle}>
          Selecione como deseja armazenar seus dados
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionCard, styles.sqliteCard]}
          onPress={() => handleSelectDatabase('sqlite')}
          activeOpacity={0.75}
        >
          <Text style={styles.optionTitle}>Armazenamento Local</Text>
          <Text style={styles.optionSubtitle}>SQLite</Text>
          <Text style={styles.optionDescription}>
            Dados salvos apenas no seu dispositivo
          </Text>
          <View style={styles.tagContainer}>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, styles.mongoCard]}
          onPress={() => handleSelectDatabase('mongodb')}
          activeOpacity={0.75}
        >
          <Text style={styles.optionTitle}>Armazenamento em Nuvem</Text>
          <Text style={styles.optionSubtitle}>MongoDB</Text>
          <Text style={styles.optionDescription}>
            Sincronize seus dados em todos os dispositivos
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Você poderá alterar isso nas configurações posteriormente
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
    padding: 20,
    justifyContent: 'space-between',
  },
  decorativeHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: '#D97D96',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    opacity: 0.08,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D97D96',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 20,
    marginVertical: 20,
  },
  optionCard: {
    padding: 28,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  sqliteCard: {
    backgroundColor: '#E8F5F9',
    borderTopWidth: 4,
    borderTopColor: '#4A90D9',
  },
  mongoCard: {
    backgroundColor: '#FFE5F0',
    borderTopWidth: 4,
    borderTopColor: '#D97D96',
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  optionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D97D96',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  tag: {
    backgroundColor: 'rgba(217, 125, 150, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 13,
    color: '#D97D96',
    fontWeight: '600',
    overflow: 'hidden',
  },
  footer: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    fontSize: 13,
    color: '#999',
  },
});
