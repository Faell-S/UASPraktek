import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../constants/colors';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { getProducts, deleteProduct } from '../services/storage';

export default function KatalogScreen({ navigation }) {
  // 3 state berbeda untuk conditional rendering: loading, error/empty, data terisi
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  async function loadProducts() {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  }

  // useEffect untuk load pertama kali
  useEffect(() => {
    loadProducts();
  }, []);

  // reload setiap kali screen difokuskan kembali (misal setelah tambah produk)
  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  function handleDelete(product) {
    Alert.alert('Hapus Produk', `Yakin ingin menghapus "${product.name}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          const updated = await deleteProduct(product.id);
          setProducts(updated);
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Katalog Produk</Text>
          <Text style={styles.subtitle}>{products.length} produk tersedia</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddProduct')}>
          <Text style={styles.addBtnText}>+ Tambah</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <LoadingSpinner label="Memuat katalog produk..." />
      ) : products.length === 0 ? (
        <EmptyState
          icon="🛍️"
          title="Belum ada produk"
          subtitle='Tekan tombol "+ Tambah" untuk menambahkan produk pertamamu'
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 8 }}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
              onDelete={() => handleDelete(item)}
            />
          )}
          ListEmptyComponent={<EmptyState title="Belum ada produk" />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  addBtn: { backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
