# 🐾 Happy Paws

Aplikasi kasir & katalog produk untuk toko perlengkapan hewan (UMKM pet shop).
Dibuat untuk UAS Mata Kuliah Pemrograman Mobile — **Domain C: Warung Digital**.

## Deskripsi Aplikasi

Happy Paws memungkinkan pemilik warung perlengkapan hewan untuk:
- Login / mendaftarkan akun toko
- Mengelola katalog produk (tambah, lihat, hapus) lengkap dengan foto
- Menambahkan produk ke keranjang belanja dan melihat total harga
- Melakukan checkout yang otomatis tercatat di riwayat transaksi
- Melihat profil toko dan logout

## Domain & Fitur

**Domain C — Warung Digital**

| Fitur Minimum | Status | Lokasi Implementasi |
|---|---|---|
| Login pemilik warung (AsyncStorage) | ✅ | `src/screens/LoginScreen.js`, `src/services/storage.js` |
| Katalog produk (FlatList + tambah/hapus) | ✅ | `src/screens/KatalogScreen.js`, `src/screens/AddProductScreen.js` |
| Keranjang belanja + total harga | ✅ | `src/screens/KeranjangScreen.js`, `src/context/CartContext.js` |
| Foto produk via expo-image-picker | ✅ | `src/screens/AddProductScreen.js` |
| Riwayat transaksi tersimpan (AsyncStorage) | ✅ | `src/screens/RiwayatScreen.js` |
| Navigasi Bottom Tab + Stack | ✅ | `src/navigation/AppNavigator.js` |

## Checklist Fitur Teknis WAJIB

1. **useState + Conditional Rendering** — `KatalogScreen.js` & `RiwayatScreen.js` punya 3 state (loading, empty, data terisi) dengan conditional rendering.
2. **React Navigation (Stack + Tab)** — Root Stack (`Login` → `Main`), Bottom Tab (`Katalog`, `Keranjang`, `Riwayat`, `Profil`), dan Stack bersarang di dalam tab Katalog (`KatalogList` → `ProductDetail` → `AddProduct`) dengan parameter (`route.params.product`).
3. **FlatList** — dipakai di `KatalogScreen`, `KeranjangScreen`, `RiwayatScreen`. Semua punya `keyExtractor` dan `ListEmptyComponent`.
4. **AsyncStorage CRUD** — 3 jenis data tersimpan: session login, daftar produk, riwayat transaksi. Semua persist setelah app ditutup (lihat `src/services/storage.js`).
5. **Form + Validasi** — `LoginScreen.js` (username/password/nama toko) dan `AddProductScreen.js` (nama, harga numerik, deskripsi) dengan pesan error jelas.
6. **Device Feature** — `expo-image-picker` di `AddProductScreen.js`, menangani permission request dan denied state.
7. **useEffect + Data Loading** — `KatalogScreen.js` dan `RiwayatScreen.js` memuat data dari AsyncStorage dengan `ActivityIndicator` (`LoadingSpinner.js`).
8. **EAS Build APK** — konfigurasi ada di `eas.json` (lihat langkah build di bawah).

## Struktur Folder

```
HappyPaws-UAS/
├── App.js
├── app.json
├── eas.json
├── package.json
├── babel.config.js
├── src/
│   ├── navigation/AppNavigator.js
│   ├── context/CartContext.js
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── KatalogScreen.js
│   │   ├── ProductDetailScreen.js
│   │   ├── AddProductScreen.js
│   │   ├── KeranjangScreen.js
│   │   ├── RiwayatScreen.js
│   │   └── ProfilScreen.js
│   ├── components/
│   │   ├── ProductCard.js
│   │   ├── LoadingSpinner.js
│   │   └── EmptyState.js
│   ├── services/
│   │   ├── storage.js
│   │   └── api.js
│   └── constants/colors.js
├── assets/
│   ├── icon.png
│   ├── splash.png
│   └── screenshots/
└── README.md
```

## Cara Menjalankan

Project ini dibuat mengikuti struktur `npx create-expo-app@latest --template blank@sdk-54`,
menggunakan **Expo SDK 54** (React Native 0.81, React 19.1).

```bash
# 1. Install dependencies
npm install

# 2. Jalankan Expo
npx expo start

# 3. Scan QR code dengan aplikasi Expo Go (versi SDK 54) di HP
```

> Jika versi paket kurang cocok, jalankan `npx expo install --check` untuk
> menyamakan otomatis dengan Expo SDK 54.

## Cara Build APK (EAS Build)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

Setelah build selesai di cloud EAS, unduh APK dari dashboard EAS lalu upload ke
GitHub Release atau Google Drive, dan pastikan link dapat diakses publik.

## Akun Demo

Tidak ada akun default — silakan **Daftar** akun toko baru dari halaman Login
(username minimal 4 karakter, password minimal 6 karakter).

## Teknologi

- React Native 0.81 + Expo SDK 54
- React Navigation v7 (Native Stack + Bottom Tabs)
- AsyncStorage untuk persistensi data lokal
- expo-image-picker untuk foto produk

## Screenshot

_Tempelkan minimal 3 screenshot alur utama (Login, Katalog, Keranjang/Riwayat) di folder `assets/screenshots/` dan referensikan di sini sebelum submit._
