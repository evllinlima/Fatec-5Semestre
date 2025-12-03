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
import { CATEGORY_VALUES, getCategoryLabel } from '../services/categoryUtils';
import type { Product } from '../services/sqliteService';

type EditProductScreenProps = NativeStackScreenProps<RootStackParamList, 'EditProduct'>;

export default function EditProductScreen({ navigation, route }: EditProductScreenProps) {
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('cleanser');
  const [observation, setObservation] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const resp: any = await skincareAPI.getProduct(productId as any);
      const p = resp.product || resp.product || resp;
      if (p) {
        const normalized: Product = {
          id: p.id || p._id || productId,
          userId: p.userId,
          name: p.name,
          category: p.category,
          photo: p.photo,
          observation: p.observation,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        } as Product;
        setProduct(normalized);
        setName(normalized.name);
        setCategory(normalized.category);
        setObservation(normalized.observation || '');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar produto');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Digite o nome do produto');
      return;
    }

    setUpdating(true);
    try {
      await skincareAPI.updateProduct(productId as any, {
        name: name.trim(),
        category,
        observation: observation.trim(),
      });

      Alert.alert('Sucesso', 'Produto atualizado!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar produto');
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
            <Text style={styles.title}>Editar Produto</Text>
            <View style={{ width: 50 }} />
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome do Produto</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome do produto"
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
              <Text style={styles.label}>Observação</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Observações sobre o produto..."
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
              onPress={handleUpdateProduct}
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
