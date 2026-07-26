import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import colors from '../constants/colors';
import LoadingSpinner from '../components/LoadingSpinner';
import { getSession, clearSession } from '../services/storage';

export default function ProfilScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      setUser(session);
      setLoading(false);
    })();
  }, []);

  function handleLogout() {
    Alert.alert('Logout', 'Yakin ingin keluar dari akun ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await clearSession();
          // Profil berada di dalam Tab Navigator, jadi reset dilakukan
          // pada Root Stack Navigator (parent) agar kembali ke LoginScreen
          const rootNavigation = navigation.getParent() || navigation;
          rootNavigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  }

  if (loading) return <LoadingSpinner label="Memuat profil..." />;

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={{ fontSize: 40 }}>🐕</Text>
      </View>
      <Text style={styles.namaToko}>{user?.namaToko || 'Toko Happy Paws'}</Text>
      <Text style={styles.username}>@{user?.username || '-'}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Tentang Happy Paws</Text>
        <Text style={styles.infoText}>
          Aplikasi kasir & katalog produk untuk toko perlengkapan hewan. Kelola produk, keranjang,
          dan riwayat transaksi dengan mudah dari satu tempat.
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', padding: 24, paddingTop: 48 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFE4CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  namaToko: { fontSize: 20, fontWeight: '800', color: colors.text },
  username: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  infoBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 28,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoLabel: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 6 },
  infoText: { fontSize: 13, color: colors.textMuted, lineHeight: 19 },
  logoutBtn: {
    marginTop: 32,
    backgroundColor: '#FBE7E7',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  logoutText: { color: colors.danger, fontWeight: '700', fontSize: 15 },
});
