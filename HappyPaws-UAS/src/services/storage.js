import AsyncStorage from '@react-native-async-storage/async-storage';

// ----- KEY KONSTAN -----
const KEYS = {
  SESSION: '@happypaws_session',      // data 1: sesi login pemilik warung
  USERS: '@happypaws_users',          // daftar akun terdaftar (register)
  PRODUCTS: '@happypaws_products',    // data 2: katalog produk
  TRANSACTIONS: '@happypaws_transactions', // data 3: riwayat transaksi
};

// ----- GENERIC HELPER -----
async function getItem(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw != null ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn('storage.getItem error', key, e);
    return fallback;
  }
}

async function setItem(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn('storage.setItem error', key, e);
    return false;
  }
}

async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.warn('storage.removeItem error', key, e);
    return false;
  }
}

// ----- SESSION (CREATE / READ / DELETE) -----
export async function saveSession(user) {
  return setItem(KEYS.SESSION, user);
}
export async function getSession() {
  return getItem(KEYS.SESSION, null);
}
export async function clearSession() {
  return removeItem(KEYS.SESSION);
}

// ----- USERS (untuk login/register) -----
export async function getUsers() {
  return getItem(KEYS.USERS, []);
}
export async function saveUser(newUser) {
  const users = await getUsers();
  users.push(newUser);
  return setItem(KEYS.USERS, users);
}
export async function findUser(username, password) {
  const users = await getUsers();
  return users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );
}
export async function usernameExists(username) {
  const users = await getUsers();
  return users.some((u) => u.username.toLowerCase() === username.toLowerCase());
}

// ----- PRODUCTS (CRUD penuh) -----
export async function getProducts() {
  return getItem(KEYS.PRODUCTS, []);
}
export async function saveProducts(products) {
  return setItem(KEYS.PRODUCTS, products);
}
export async function addProduct(product) {
  const products = await getProducts();
  const updated = [...products, product];
  await saveProducts(updated);
  return updated;
}
export async function deleteProduct(productId) {
  const products = await getProducts();
  const updated = products.filter((p) => p.id !== productId);
  await saveProducts(updated);
  return updated;
}

// ----- TRANSACTIONS (Riwayat) -----
export async function getTransactions() {
  return getItem(KEYS.TRANSACTIONS, []);
}
export async function addTransaction(transaction) {
  const transactions = await getTransactions();
  const updated = [transaction, ...transactions];
  await setItem(KEYS.TRANSACTIONS, updated);
  return updated;
}

export default {
  saveSession,
  getSession,
  clearSession,
  getUsers,
  saveUser,
  findUser,
  usernameExists,
  getProducts,
  saveProducts,
  addProduct,
  deleteProduct,
  getTransactions,
  addTransaction,
};
