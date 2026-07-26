import React from 'react';
import { Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import colors from '../constants/colors';

import LoginScreen from '../screens/LoginScreen';
import KatalogScreen from '../screens/KatalogScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import AddProductScreen from '../screens/AddProductScreen';
import KeranjangScreen from '../screens/KeranjangScreen';
import RiwayatScreen from '../screens/RiwayatScreen';
import ProfilScreen from '../screens/ProfilScreen';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const KatalogStack = createNativeStackNavigator();

// Stack Navigator bersarang untuk alur Katalog -> Detail -> Tambah Produk
function KatalogStackNavigator() {
  return (
    <KatalogStack.Navigator>
      <KatalogStack.Screen name="KatalogList" component={KatalogScreen} options={{ title: 'Katalog Produk' }} />
      <KatalogStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Detail Produk' }}
      />
      <KatalogStack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ title: 'Tambah Produk' }}
      />
    </KatalogStack.Navigator>
  );
}

const TAB_ICON = {
  Katalog: '🛍️',
  Keranjang: '🛒',
  Riwayat: '🧾',
  Profil: '🐾',
};

// Bottom Tab Navigator untuk navigasi utama
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: () => <Text style={{ fontSize: 18 }}>{TAB_ICON[route.name]}</Text>,
      })}
    >
      <Tab.Screen name="Katalog" component={KatalogStackNavigator} />
      <Tab.Screen name="Keranjang" component={KeranjangScreen} />
      <Tab.Screen name="Riwayat" component={RiwayatScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
}

// Root Stack: Login -> Main (Tab)
export default function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Main" component={MainTabNavigator} />
    </RootStack.Navigator>
  );
}
