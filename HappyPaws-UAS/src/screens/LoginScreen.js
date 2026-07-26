import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import colors from '../constants/colors';
import { saveSession, saveUser, findUser, usernameExists, getSession } from '../services/storage';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LoginScreen({ navigation }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [namaToko, setNamaToko] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Cek apakah sudah pernah login sebelumnya (session tersimpan di AsyncStorage)
  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session) {
        navigation.replace('Main');
      } else {
        setCheckingSession(false);
      }
    })();
  }, []);

  if (checkingSession) {
    return <LoadingSpinner label="Memeriksa sesi login..." />;
  }

  function validate() {
    const e = {};
    if (!username.trim()) e.username = 'Username tidak boleh kosong';
    else if (username.trim().length < 4) e.username = 'Username minimal 4 karakter';

    if (!password) e.password = 'Password tidak boleh kosong';
    else if (password.length < 6) e.password = 'Password minimal 6 karakter';

    if (mode === 'register' && !namaToko.trim()) e.namaToko = 'Nama toko tidak boleh kosong';

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === 'register') {
        const exists = await usernameExists(username.trim());
        if (exists) {
          setErrors({ username: 'Username sudah terdaftar, silakan login' });
          setLoading(false);
          return;
        }
        const user = { username: username.trim(), password, namaToko: namaToko.trim() };
        await saveUser(user);
        await saveSession(user);
      } else {
        const user = await findUser(username.trim(), password);
        if (!user) {
          setErrors({ general: 'Username atau password salah' });
          setLoading(false);
          return;
        }
        await saveSession(user);
      }
      navigation.replace('Main');
    } catch (e) {
      setErrors({ general: 'Terjadi kesalahan, coba lagi' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>🐾</Text>
        <Text style={styles.title}>Happy Paws</Text>
        <Text style={styles.subtitle}>Toko perlengkapan hewan kesayanganmu</Text>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, mode === 'login' && styles.tabBtnActive]}
            onPress={() => { setMode('login'); setErrors({}); }}
          >
            <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, mode === 'register' && styles.tabBtnActive]}
            onPress={() => { setMode('register'); setErrors({}); }}
          >
            <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>Daftar</Text>
          </TouchableOpacity>
        </View>

        {mode === 'register' && (
          <View style={styles.field}>
            <Text style={styles.label}>Nama Toko</Text>
            <TextInput
              style={styles.input}
              placeholder="contoh: Happy Paws Medan"
              value={namaToko}
              onChangeText={setNamaToko}
            />
            {errors.namaToko && <Text style={styles.error}>{errors.namaToko}</Text>}
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="username"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
          {errors.username && <Text style={styles.error}>{errors.username}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="minimal 6 karakter"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {errors.password && <Text style={styles.error}>{errors.password}</Text>}
        </View>

        {errors.general && <Text style={[styles.error, { textAlign: 'center' }]}>{errors.general}</Text>}

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>{mode === 'login' ? 'Masuk' : 'Daftar & Masuk'}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  logo: { fontSize: 48, textAlign: 'center' },
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center', color: colors.text, marginTop: 4 },
  subtitle: { fontSize: 13, textAlign: 'center', color: colors.textMuted, marginBottom: 24 },
  tabRow: { flexDirection: 'row', backgroundColor: '#F0E6D8', borderRadius: 10, padding: 4, marginBottom: 20 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  tabBtnActive: { backgroundColor: colors.primary },
  tabText: { fontWeight: '600', color: colors.textMuted },
  tabTextActive: { color: '#fff' },
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
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
