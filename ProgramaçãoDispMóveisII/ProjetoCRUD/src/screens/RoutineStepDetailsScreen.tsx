import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { skincareAPI } from '../services/apiClient';
import type { RoutineStep } from '../services/sqliteService';

type RoutineStepDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'RoutineStepDetails'>;

export default function RoutineStepDetailsScreen({ navigation, route }: RoutineStepDetailsScreenProps) {
  const { stepId } = route.params;
  const [step, setStep] = useState<RoutineStep | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStep();
  }, []);

  const loadStep = async () => {
    try {
      const resp: any = await skincareAPI.getRoutineStep(stepId as any);
      const s = resp.step || resp.step || resp;
      if (s) {
        setStep({
          id: s.id || s._id || (stepId as any),
          userId: s.userId,
          name: s.name,
          timeOfDay: s.timeOfDay,
          productId: s.productId || null,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        } as RoutineStep);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar etapa');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar exclusão',
      'Deseja realmente excluir esta etapa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
            onPress: async () => {
            try {
              await skincareAPI.deleteRoutineStep(stepId as any);
              Alert.alert('Sucesso', 'Etapa excluída', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              Alert.alert('Erro', 'Falha ao excluir etapa');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D97D96" />
        </View>
      </SafeAreaView>
    );
  }

  if (!step) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Etapa não encontrada</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const emoji = step.timeOfDay === 'morning' ? '' : '';
  const timeLabel = step.timeOfDay === 'morning' ? 'Manhã' : 'Noite';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>← Voltar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>

          <Text style={styles.title}>{step.name}</Text>

          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Horário</Text>
              <Text style={styles.fieldValue}>{timeLabel}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Adicionado em</Text>
              <Text style={styles.fieldValue}>
                {step.createdAt ? new Date(step.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('EditRoutineStep', { stepId })}
            >
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5F0',
  },
  backLink: {
    fontSize: 16,
    color: '#D97D96',
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#D97D96',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emojiContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D97D96',
    marginBottom: 6,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    gap: 12,
  },
  editButton: {
    backgroundColor: '#D97D96',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
