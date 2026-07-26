import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import colors from '../constants/colors';
import { addProduct } from '../services/storage';

export default function AddProductScreen({ navigation }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setPermissionDenied(true);
      Alert.alert(
        'Izin Ditolak',
        'Happy Paws membutuhkan izin akses galeri untuk mengambil foto produk. Silakan aktifkan izin di pengaturan HP.'
      );
      return;
    }
    setPermissionDenied(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.6,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Nama produk tidak boleh kosong';
    if (!price.trim()) e.price = 'Harga tidak boleh kosong';
    else if (isNaN(Number(price)) || Number(price) <= 0) e.price = 'Harga harus berupa angka lebih dari 0';
    if (!description.trim()) e.description = 'Deskripsi tidak boleh kosong';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    const product = {
      id: `prod-${Date.now()}`,
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      image,
      createdAt: new Date().toISOString(),
    };
    await addProduct(product);
    setSaving(false);
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Tambah Produk Baru</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={{ fontSize: 32 }}>📷</Text>
            <Text style={styles.imagePlaceholderText}>Ambil Foto Produk</Text>
          </View>
        )}
      </TouchableOpacity>
      {permissionDenied && (
        <Text style={styles.error}>Izin galeri ditolak. Produk tetap bisa disimpan tanpa foto.</Text>
      )}

      <View style={styles.field}>
        <Text style={styles.label}>Nama Produk</Text>
        <TextInput
          style={styles.input}
          placeholder="contoh: Dog Food Premium 1kg"
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text style={styles.error}>{errors.name}</Text>}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Harga (Rp)</Text>
        <TextInput
          style={styles.input}
          placeholder="contoh: 85000"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        {errors.price && <Text style={styles.error}>{errors.price}</Text>}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Deskripsi</Text>
        <TextInput
          style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
          placeholder="Jelaskan produk secara singkat..."
          multiline
          value={description}
          onChangeText={setDescription}
        />
        {errors.description && <Text style={styles.error}>{errors.description}</Text>}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Simpan Produk</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 16 },
  imagePicker: { alignSelf: 'center', marginBottom: 16 },
  imagePreview: { width: 140, height: 140, borderRadius: 14 },
  imagePlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: { fontSize: 12, color: colors.textMuted, marginTop: 6 },
  field: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  error: { color: colors.danger, fontSize: 12, marginTop: 4 },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
