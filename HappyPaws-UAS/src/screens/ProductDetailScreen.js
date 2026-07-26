import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import colors from '../constants/colors';
import { useCart } from '../context/CartContext';

function formatRupiah(value) {
  return 'Rp' + Number(value).toLocaleString('id-ID');
}

export default function ProductDetailScreen({ route, navigation }) {
  // Menerima parameter 'product' yang dikirim dari KatalogScreen
  const { product } = route.params;
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  function handleAddToCart() {
    addToCart(product, qty);
    Alert.alert('Berhasil', `${product.name} (x${qty}) ditambahkan ke keranjang`, [
      { text: 'Lanjut Belanja', onPress: () => navigation.goBack() },
      { text: 'Lihat Keranjang', onPress: () => navigation.navigate('Keranjang') },
    ]);
  }

  return (
    <ScrollView style={styles.container}>
      {product.image ? (
        <Image source={{ uri: product.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={{ fontSize: 48 }}>🐾</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{formatRupiah(product.price)}</Text>
        <Text style={styles.descLabel}>Deskripsi</Text>
        <Text style={styles.desc}>{product.description}</Text>

        <View style={styles.qtyRow}>
          <Text style={styles.qtyLabel}>Jumlah</Text>
          <View style={styles.qtyControl}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty((q) => Math.max(1, q - 1))}>
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{qty}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty((q) => q + 1)}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
          <Text style={styles.cartBtnText}>Tambah ke Keranjang · {formatRupiah(product.price * qty)}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  image: { width: '100%', height: 260 },
  imagePlaceholder: { backgroundColor: '#F0E6D8', alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20 },
  name: { fontSize: 22, fontWeight: '800', color: colors.text },
  price: { fontSize: 18, fontWeight: '700', color: colors.primaryDark, marginTop: 6 },
  descLabel: { fontSize: 13, fontWeight: '700', color: colors.text, marginTop: 18 },
  desc: { fontSize: 14, color: colors.textMuted, marginTop: 6, lineHeight: 20 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 },
  qtyLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  qtyControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: colors.border },
  qtyBtn: { paddingHorizontal: 16, paddingVertical: 8 },
  qtyBtnText: { fontSize: 18, fontWeight: '700', color: colors.primary },
  qtyValue: { fontSize: 15, fontWeight: '700', minWidth: 24, textAlign: 'center' },
  cartBtn: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginTop: 28 },
  cartBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
