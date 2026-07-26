import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import colors from '../constants/colors';
import EmptyState from '../components/EmptyState';
import { useCart } from '../context/CartContext';
import { addTransaction } from '../services/storage';

function formatRupiah(value) {
  return 'Rp' + Number(value).toLocaleString('id-ID');
}

export default function KeranjangScreen({ navigation }) {
  const { cartItems, removeFromCart, updateQty, clearCart, totalHarga, totalItem } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  async function handleCheckout() {
    if (cartItems.length === 0) return;
    setCheckingOut(true);
    const transaction = {
      id: `trx-${Date.now()}`,
      items: cartItems,
      totalItem,
      totalHarga,
      createdAt: new Date().toISOString(),
    };
    await addTransaction(transaction);
    clearCart();
    setCheckingOut(false);
    Alert.alert('Transaksi Berhasil', 'Pesanan telah dicatat di Riwayat Transaksi', [
      { text: 'Lihat Riwayat', onPress: () => navigation.navigate('Riwayat') },
      { text: 'OK' },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Keranjang Belanja</Text>

      {cartItems.length === 0 ? (
        <EmptyState icon="🛒" title="Keranjang kosong" subtitle="Yuk tambahkan produk dari halaman Katalog" />
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item }) => (
              <View style={styles.row}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.thumb} />
                ) : (
                  <View style={[styles.thumb, styles.thumbPlaceholder]}>
                    <Text>🐾</Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{formatRupiah(item.price)} x {item.qty}</Text>
                </View>
                <View style={styles.qtyControl}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, item.qty - 1)}>
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.qty}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, item.qty + 1)}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeBtn}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={<EmptyState title="Keranjang kosong" />}
          />

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total ({totalItem} item)</Text>
              <Text style={styles.summaryValue}>{formatRupiah(totalHarga)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} disabled={checkingOut}>
              <Text style={styles.checkoutText}>{checkingOut ? 'Memproses...' : 'Checkout Sekarang'}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, padding: 16, paddingBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumb: { width: 48, height: 48, borderRadius: 8, marginRight: 10 },
  thumbPlaceholder: { backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  itemName: { fontSize: 14, fontWeight: '700', color: colors.text },
  itemPrice: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', marginRight: 6 },
  qtyBtn: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: colors.background, borderRadius: 6 },
  qtyBtnText: { fontSize: 15, fontWeight: '700', color: colors.primary },
  qtyValue: { minWidth: 22, textAlign: 'center', fontWeight: '700' },
  removeBtn: { paddingHorizontal: 6 },
  removeText: { color: colors.danger, fontSize: 16, fontWeight: '700' },
  summary: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: colors.textMuted },
  summaryValue: { fontSize: 18, fontWeight: '800', color: colors.text },
  checkoutBtn: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 15, alignItems: 'center' },
  checkoutText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
