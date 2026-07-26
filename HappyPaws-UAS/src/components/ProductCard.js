import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';

function formatRupiah(value) {
  return 'Rp' + Number(value).toLocaleString('id-ID');
}

export default function ProductCard({ product, onPress, onDelete }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {product.image ? (
        <Image source={{ uri: product.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={{ fontSize: 24 }}>🐶</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.price}>{formatRupiah(product.price)}</Text>
        <Text style={styles.desc} numberOfLines={2}>{product.description}</Text>
      </View>
      {onDelete && (
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Text style={styles.deleteText}>Hapus</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: { width: 60, height: 60, borderRadius: 10, marginRight: 12, backgroundColor: colors.background },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  price: { fontSize: 14, color: colors.primaryDark, fontWeight: '600', marginTop: 2 },
  desc: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  deleteBtn: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#FBE7E7', borderRadius: 8 },
  deleteText: { color: colors.danger, fontSize: 12, fontWeight: '600' },
});
