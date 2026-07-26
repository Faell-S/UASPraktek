import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../constants/colors';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { getTransactions } from '../services/storage';

function formatRupiah(value) {
  return 'Rp' + Number(value).toLocaleString('id-ID');
}

function formatTanggal(iso) {
  const d = new Date(iso);
  return d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function RiwayatScreen() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  async function loadTransactions() {
    setLoading(true);
    const data = await getTransactions();
    setTransactions(data);
    setLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riwayat Transaksi</Text>

      {loading ? (
        <LoadingSpinner label="Memuat riwayat transaksi..." />
      ) : transactions.length === 0 ? (
        <EmptyState icon="🧾" title="Belum ada transaksi" subtitle="Riwayat akan muncul setelah kamu checkout" />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 8 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.trxId}>#{item.id.slice(-6)}</Text>
                <Text style={styles.trxDate}>{formatTanggal(item.createdAt)}</Text>
              </View>
              {item.items.map((p) => (
                <Text key={p.id} style={styles.itemLine} numberOfLines={1}>
                  {p.qty}x {p.name}
                </Text>
              ))}
              <View style={styles.cardFooter}>
                <Text style={styles.totalItem}>{item.totalItem} item</Text>
                <Text style={styles.totalHarga}>{formatRupiah(item.totalHarga)}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<EmptyState title="Belum ada transaksi" />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, padding: 16, paddingBottom: 8 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  trxId: { fontWeight: '700', color: colors.text },
  trxDate: { fontSize: 12, color: colors.textMuted },
  itemLine: { fontSize: 13, color: colors.textMuted, marginBottom: 2 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalItem: { fontSize: 13, color: colors.textMuted },
  totalHarga: { fontSize: 15, fontWeight: '800', color: colors.primaryDark },
});
