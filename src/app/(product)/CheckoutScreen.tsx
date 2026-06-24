import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import SafeScreen from '@/components/SafeScreen'
import { colors } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import OrderSummary from '@/components/OrderSummary'
import api from '@/api/axios'

export default function CheckoutScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const params = useLocalSearchParams();
  const subtotal = Number(params.subtotal || 0);
  const shipping = Number(params.shipping || 0);
  const tax = Number(params.tax || 0);
  const total = Number(params.total || 0);

  const handelCheckout = async () => {
    setLoading(true)
    try {
      const getItems: any = await SecureStore.getItemAsync('cart')
      const items = getItems ? JSON.parse(getItems) : []

      if (items.length === 0) {
        Alert.alert("Error", "Your cart is empty");
        setLoading(false);
        return;
      }

      const formattedItems = items.map((i: any) => ({ 
        productId: Number(i.product?.id || i.productId || i.id), 
        quantity: Number(i.quantity || 1) 
      }));

      const orderRes = await api.post('/orders', {
        items: formattedItems
      })

      await SecureStore.setItemAsync('cart', JSON.stringify([]))

      await api.post('/payments', {
        orderId: orderRes.data.id
      })

      Alert.alert("Success", "Your order has been placed successfully!", [
        { text: "OK", onPress: () => router.replace('/(tabs)') } 
      ])
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;

      let finalMessage = error.message;
      if (serverMessage) {
        finalMessage = Array.isArray(serverMessage) ? serverMessage.join("\n") : serverMessage;
      }

      Alert.alert('Error Details', finalMessage);
      console.log(finalMessage)
    } finally {
      setLoading(false) 
    }
  }

  return (
    <SafeScreen>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTxt}>Checkout</Text>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="card" size={20} color={colors.primary.DEFAULT} />
              <Text style={styles.cardTitle}>Credit / Debit Card</Text>
            </View>
            <Text style={styles.cardBody}>•••• •••• •••• 4242</Text>
          </View>
        </View>

        <OrderSummary
          shipping={shipping}
          subtotal={subtotal}
          tax={tax}
          total={total}
        />
      </ScrollView>

      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.9}
          disabled={loading}
          onPress={handelCheckout}
        >
          <View style={styles.buttonContent}>
            {loading ? (
              <ActivityIndicator size="small" color="#121212" />
            ) : (
              <>
                <Text style={styles.buttonText}>Place Order</Text>
                <Ionicons name="checkmark-circle" size={20} color="#121212" />
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
    paddingHorizontal: 24,
    gap: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 12,
  },
  backButton: {
    marginRight: 16,
  },
  headerTxt: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  sectionContainer: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.text.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface.DEFAULT,
    borderRadius: 24,
    padding: 20,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardBody: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(18, 18, 18, 0.95)",
    borderTopWidth: 1,
    borderTopColor: colors.surface.DEFAULT,
    paddingTop: 16,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  actionButton: {
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonContent: {
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.background.DEFAULT,
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 8,
  },
})