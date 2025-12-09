import React, { useState } from 'react';
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
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../contexts/AuthContext';
import { skincareAPI } from '../services/apiClient';

type AddRoutineStepScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddRoutineStep'>;
};

export default function AddRoutineStepScreen({ navigation }: AddRoutineStepScreenProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'night'>('morning');
  const [loading, setLoading] = useState(false);

  const handleAddStep = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Digite o nome da etapa');
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      await skincareAPI.createRoutineStep({ name: name.trim(), timeOfDay });

      Alert.alert('Sucesso', 'Etapa adicionada!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao adicionar etapa');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
            <Text style={styles.title}>Adicionar Etapa</Text>
            <View style={{ width: 50 }} />
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome da Etapa *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Limpeza, Sérum, Hidratante..."
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

            <View style={styles.hint}>
              <Text style={styles.hintText}>
                Dica: Organize suas etapas para criar uma rotina diária eficiente
              </Text>
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
              onPress={handleAddStep}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Adicionando...' : 'Adicionar'}
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
  hint: {
    backgroundColor: '#FFE5F0',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  hintText: {
    color: '#D97D96',
    fontSize: 14,
    fontWeight: '500',
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
