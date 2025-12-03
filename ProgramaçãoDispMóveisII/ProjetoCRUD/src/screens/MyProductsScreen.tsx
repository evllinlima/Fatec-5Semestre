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
import type { Product } from '../services/sqliteService';

type MyProductsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MyProducts'>;
};

export default function MyProductsScreen({ navigation }: MyProductsScreenProps) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadProducts();
    }, [])
  );

  const loadProducts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const resp: any = await skincareAPI.getProducts();
      // resposta remota vem como { products } e local vem como { products }
      const items = resp.products || resp.products || [];
      // Normalizar: usar _id quando presente
      const normalized: Product[] = (items || []).map((p: any, idx: number) => ({
        id: p.id || p._id || idx,
        userId: p.userId || (user.id as number),
        name: p.name,
        category: p.category,
        photo: p.photo,
        observation: p.observation,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }));

      setProducts(normalized);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar produtos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.productHeader}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
        </View>
        <Text style={styles.categoryEmoji}>
          {getCategoryEmoji(item.category)}
        </Text>
      </View>
      {item.observation && (
        <Text style={styles.productObservation} numberOfLines={2}>
          {item.observation}
        </Text>
      )}
    </TouchableOpacity>
  );

  const getCategoryEmoji = (category: string) => {
    return '';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Meus Produtos</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddProduct')}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum produto ainda</Text>
          <Text style={styles.emptyHint}>Adicione seus produtos de skincare</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('AddProduct')}
          >
            <Text style={styles.emptyButtonText}>Adicionar Produto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          onRefresh={loadProducts}
          refreshing={loading}
        />
      )}
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
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#D97D96',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 6,
    borderLeftColor: '#D97D96',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#999',
  },
  categoryEmoji: {
    fontSize: 32,
    marginLeft: 12,
  },
  productObservation: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
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
