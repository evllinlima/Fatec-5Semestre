import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useAuth } from '../contexts/AuthContext';
import { skincareAPI } from '../services/apiClient';
import type { RoutineStep } from '../services/sqliteService';

type MyRoutineScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MyRoutine'>;
};

export default function MyRoutineScreen({ navigation }: MyRoutineScreenProps) {
  const { user } = useAuth();
  const [steps, setSteps] = useState<RoutineStep[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadSteps();
    }, [])
  );

  const loadSteps = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const resp: any = await skincareAPI.getRoutineSteps();

      // API remota retorna { morning: { steps: [...] }, night: { steps: [...] } }
      const morning = resp?.morning?.steps || [];
      const night = resp?.night?.steps || [];

      const normalize = (arr: any[]) =>
        arr.map((s: any, idx: number) => ({
          id: s.id || s._id || idx,
          userId: s.userId,
          name: s.name,
          timeOfDay: s.timeOfDay,
          productId: s.productId || null,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        } as RoutineStep));

      setSteps([...normalize(morning), ...normalize(night)]);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar rotina');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const morningSteps = steps.filter((s) => s.timeOfDay === 'morning');
  const nightSteps = steps.filter((s) => s.timeOfDay === 'night');

  const renderStep = ({ item }: { item: RoutineStep }) => (
    <TouchableOpacity
      style={styles.stepCard}
      onPress={() => navigation.navigate('RoutineStepDetails', { stepId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.stepContent}>
        <Text style={styles.stepName}>{item.name}</Text>
        {item.productId && <Text style={styles.stepProduct}>✓ Com produto</Text>}
      </View>
      <Text style={styles.stepChevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Minha Rotina</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddRoutineStep')}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+ Etapa</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={[{ type: 'morning' }, { type: 'steps', steps: morningSteps }, { type: 'night' }, { type: 'steps', steps: nightSteps }]}
        renderItem={({ item }: any) => {
          if (item.type === 'morning') {
            return <Text style={styles.sectionTitle}>Manhã</Text>;
          }
          if (item.type === 'night') {
            return <Text style={styles.sectionTitle}>Noite</Text>;
          }
          if (item.type === 'steps') {
            return item.steps.length === 0 ? (
              <Text style={styles.emptySection}>Nenhuma etapa adicionada</Text>
            ) : (
              <FlatList
                data={item.steps}
                renderItem={renderStep}
                keyExtractor={(step) => String(step.id)}
                scrollEnabled={false}
              />
            );
          }
          return null;
        }}
        keyExtractor={(item, index) => String(index)}
        contentContainerStyle={styles.listContent}
        onRefresh={loadSteps}
        refreshing={loading}
        ListEmptyComponent={
          steps.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma etapa ainda</Text>
              <Text style={styles.emptyHint}>Crie sua rotina de skincare</Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('AddRoutineStep')}
              >
                <Text style={styles.emptyButtonText}>Adicionar Etapa</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#FFF5F8',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5F0',
  },
  backButton: {
    fontSize: 16,
    color: '#D97D96',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#D97D96',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stepContent: {
    flex: 1,
  },
  stepName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  stepProduct: {
    fontSize: 12,
    color: '#D97D96',
  },
  stepChevron: {
    fontSize: 20,
    color: '#D97D96',
  },
  emptySection: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginVertical: 12,
    marginHorizontal: 12,
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 16,
    color: '#999',
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: '#D97D96',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 20,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
