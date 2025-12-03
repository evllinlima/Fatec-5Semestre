import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { skincareAPI } from '../services/apiClient';
import type { RoutineStep } from '../services/sqliteService';

type EditRoutineStepScreenProps = NativeStackScreenProps<RootStackParamList, 'EditRoutineStep'>;

export default function EditRoutineStepScreen({ navigation, route }: EditRoutineStepScreenProps) {
  const { stepId } = route.params;
  const [step, setStep] = useState<RoutineStep | null>(null);
  const [name, setName] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'night'>('morning');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadStep();
  }, []);

  const loadStep = async () => {
    try {
      const resp: any = await skincareAPI.getRoutineStep(stepId as any);
      const s = resp.step || resp.step || resp;
      if (s) {
        const normalized: RoutineStep = {
          id: s.id || s._id || (stepId as any),
          userId: s.userId,
          name: s.name,
          timeOfDay: s.timeOfDay,
          productId: s.productId || null,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        } as RoutineStep;
        setStep(normalized);
        setName(normalized.name);
        setTimeOfDay(normalized.timeOfDay);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar etapa');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStep = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Digite o nome da etapa');
      return;
    }

    setUpdating(true);
    try {
      await skincareAPI.updateRoutineStep(stepId as any, { name: name.trim(), timeOfDay });

      Alert.alert('Sucesso', 'Etapa atualizada!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar etapa');
      console.error(error);
    } finally {
      setUpdating(false);
    }
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>← Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Editar Etapa</Text>
            <View style={{ width: 50 }} />
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome da Etapa</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome da etapa"
                placeholderTextColor="#CCC"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Horário</Text>
              <View style={styles.timeOptions}>
                <TouchableOpacity
                  style={[
                    styles.timeButton,
                    timeOfDay === 'morning' && styles.timeButtonActive,
                  ]}
                  onPress={() => setTimeOfDay('morning')}
                >
                  <Text
                    style={[
                      styles.timeButtonText,
                      timeOfDay === 'morning' && styles.timeButtonActiveText,
                    ]}
                  >
                    Manhã
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.timeButton,
                    timeOfDay === 'night' && styles.timeButtonActive,
                  ]}
                  onPress={() => setTimeOfDay('night')}
                >
                  <Text
                    style={[
                      styles.timeButtonText,
                      timeOfDay === 'night' && styles.timeButtonActiveText,
                    ]}
                  >
                    Noite
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleUpdateStep}
              disabled={updating}
            >
              <Text style={styles.submitButtonText}>
                {updating ? 'Atualizando...' : 'Atualizar'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5F0',
  },
  backButton: {
    fontSize: 16,
    color: '#D97D96',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8B4C8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  timeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  timeButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E8B4C8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  timeButtonActive: {
    backgroundColor: '#D97D96',
    borderColor: '#D97D96',
  },
  timeButtonEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  timeButtonText: {
    fontSize: 14,
    color: '#D97D96',
    fontWeight: '600',
  },
  timeButtonActiveText: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E8B4C8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#D97D96',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
