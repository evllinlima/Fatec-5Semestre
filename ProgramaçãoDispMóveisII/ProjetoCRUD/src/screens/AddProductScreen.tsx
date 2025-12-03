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
import { CATEGORY_VALUES, getCategoryLabel } from '../services/categoryUtils';

type AddProductScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddProduct'>;
};

export default function AddProductScreen({ navigation }: AddProductScreenProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('cleanser');
  const [observation, setObservation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Digite o nome do produto');
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      // skincareAPI roteia para SQLite ou MongoDB dependendo da seleção
      await skincareAPI.createProduct({
        name: name.trim(),
        category,
        observation: observation.trim(),
      });

      Alert.alert('Sucesso', 'Produto adicionado!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao adicionar produto');
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
            <Text style={styles.title}>Adicionar Produto</Text>
            <View style={{ width: 50 }} />
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome do Produto *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Sérum Vitamina C"
                placeholderTextColor="#CCC"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Categoria</Text>
              <View style={styles.categoryOptions}>
                {CATEGORY_VALUES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryButton,
                      category === cat && styles.categoryButtonActive,
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        category === cat && styles.categoryButtonActiveText,
                      ]}
                    >{getCategoryLabel(cat)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Observação (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ex: Aplicar à noite, usar com protetor..."
                placeholderTextColor="#CCC"
                value={observation}
                onChangeText={setObservation}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
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
              onPress={handleAddProduct}
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
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E8B4C8',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#D97D96',
    borderColor: '#D97D96',
  },
  categoryButtonText: {
    fontSize: 13,
    color: '#D97D96',
    fontWeight: '600',
  },
  categoryButtonActiveText: {
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
