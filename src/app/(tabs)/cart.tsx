import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect, useRouter } from 'expo-router';
import SafeScreen from '@/components/SafeScreen'
import { colors } from '@/constants/theme'
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import OrderSummary from '@/components/OrderSummary';

interface CartItem {
  id: string | number;
  title: string;
  price: number;
  quantity: number;
  stock: number;
  [key: string]: any;
}

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isUpdating, setIsUpdating] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)

  const router = useRouter()

  const getCart = async () => {
    try {
      const cart: any = await SecureStore.getItemAsync('cart')
      if (cart) {
        setCartItems(JSON.parse(cart))
      } else {
        setCartItems([])
      }
    } catch (error) {
      console.error("Error fetching cart from SecureStore:", error);
    }
  }

  let subtotal = 0;
  let cartItemCount = 0;
  for (const item of cartItems) {
    subtotal += Number(item.quantity) * item.price;
    cartItemCount += item.quantity;
  }

  const shipping = subtotal > 0 ? 10.00 : 0;
  const tax = subtotal * 0.10;
  const total = subtotal + shipping + tax;

  useFocusEffect(
    useCallback(() => {
      getCart()
    }, [])
  )

  const handelDelete = async (id: any) => {
    const newCartItems = cartItems.filter(item => item.id !== id)
    setCartItems(newCartItems)
    try {
      await SecureStore.setItemAsync('cart', JSON.stringify(newCartItems))
    } catch (error) {
      console.log(error)
    }
  }

  const plusBtn = async (item: any) => {
    const nextQuantity = item.quantity + 1;

    if (nextQuantity > item.stock) {
      Alert.alert('Out of stock')
      return;
    }

    const updateCart = cartItems.map(cartItem => {
      if (cartItem.id === item.id)
        return { ...cartItem, quantity: nextQuantity }
      return cartItem;
    })

    setCartItems(updateCart)

    try {
      await SecureStore.setItemAsync('cart', JSON.stringify(updateCart))
    } catch (error) {
      console.log(error)
    }
  }

  const minusBtn = async (item: any) => {
    if (item.quantity <= 1) {
      await handelDelete(item.id);
      return;
    }

    const newQuantity = item.quantity - 1;
    const updateCart = cartItems.map(cartItem => {
      if (cartItem.id === item.id) {
        return { ...cartItem, quantity: newQuantity }
      }
      return cartItem;
    })
    setCartItems(updateCart)
    try {
      await SecureStore.setItemAsync('cart', JSON.stringify(updateCart))
    } catch (error) {
      console.log(error)
    }
  }

  if(cartItems.length == 0) {
    return(
      <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTxt}>Cart</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Ionicons name="cart-outline" size={80} color={colors.text.secondary} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>
          Add some products to get started
        </Text>
      </View>
    </View>
    )
  }

  return (
    <SafeScreen>
      <Text style={styles.headerTxt}>Cart</Text>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.itemsWrapper}>
          {cartItems.map((item: any) => {

            const isItemDisabled = item.quantity >= item.stock
            const isItemDisabled2 = item.quantity <= 0

            return (
              <View key={item.id} style={styles.cardContainer}>
                <View style={styles.rowContent}>

                  <View style={styles.imageWrapper}>
                    <Image
                      source={item.image}
                      contentFit="cover"
                      style={styles.image}
                    />
                    <View style={styles.imageBadge}>
                      <Text style={styles.imageBadgeText}>×{item.quantity}</Text>
                    </View>
                  </View>

                  <View style={styles.detailsContainer}>
                    <View>
                      <Text style={styles.productName} numberOfLines={2}>
                        {item.name}
                      </Text>

                      <View style={styles.priceRow}>
                        <Text style={styles.totalPrice}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Text>
                        <Text style={styles.eachPrice}>
                          ${item.price} each
                        </Text>
                      </View>
                    </View>

                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        style={[styles.minusButton, isItemDisabled2 && styles.disabledBtn]}
                        activeOpacity={0.7}
                        disabled={isItemDisabled2}
                        onPress={() => minusBtn(item)}
                      >
                        {isUpdating ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <Ionicons name="remove" size={18} color="#FFFFFF" />
                        )}
                      </TouchableOpacity>

                      <View style={styles.quantityTextContainer}>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                      </View>

                      <TouchableOpacity
                        style={[styles.plusButton, isItemDisabled && styles.disabledBtn]}
                        activeOpacity={0.7}
                        disabled={isUpdating || isItemDisabled}
                        onPress={() => plusBtn(item)}
                      >
                        {isUpdating ? (
                          <ActivityIndicator size="small" color="#121212" />
                        ) : (
                          <Ionicons name="add" size={18} color="#121212" />
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.removeButton}
                        activeOpacity={0.7}
                        onPress={() => handelDelete(item.id)}
                      >
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>

                  </View>
                </View>
              </View>
            )
          })}
        </View>

        {cartItems.length > 0 && (
          <OrderSummary
            shipping={shipping}
            subtotal={subtotal}
            tax={tax}
            total={total}
          />
        )}
      </ScrollView>
      
      <View style={styles.footerContainer}>
        <View style={styles.statsRow}>
          <View style={styles.iconTextGroup}>
            <Ionicons name="cart" size={20} color="#1DB954" />
            <Text style={styles.itemCountText}>
              {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
            </Text>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalPriceText}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          activeOpacity={0.9}
          disabled={paymentLoading}
          onPress={() => router.push({
            pathname: '/(product)/CheckoutScreen',
            params: {
              subtotal: subtotal.toFixed(2),
              shipping: shipping.toFixed(2),
              tax: tax.toFixed(2),
              total: total.toFixed(2)
            }
          })}
        >
          <View style={styles.buttonContent}>
            {paymentLoading ? (
              <ActivityIndicator size="small" color="#121212" />
            ) : (
              <>
                <Text style={styles.checkoutText}>Checkout</Text>
                <Ionicons name="arrow-forward" size={20} color="#121212" />
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  )
}

export default CartScreen

const styles = StyleSheet.create({
  headerTxt: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    color: colors.text.primary,
    fontSize: 22,
    paddingTop: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 300,
  },
  itemsWrapper: {
    paddingHorizontal: 24,
    gap: 8,
  },
  cardContainer: {
    backgroundColor: colors.surface.DEFAULT,
    borderRadius: 24,
    overflow: 'hidden',
  },
  rowContent: {
    padding: 16,
    flexDirection: 'row',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    backgroundColor: colors.background.lighter,
    width: 112,
    height: 112,
    borderRadius: 16,
  },
  imageBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  imageBadgeText: {
    color: colors.background.DEFAULT,
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  productName: {
    color: colors.text.primary,
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 22,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  totalPrice: {
    color: colors.primary.DEFAULT,
    fontWeight: 'bold',
    fontSize: 12,
  },
  eachPrice: {
    color: colors.text.secondary,
    fontSize: 8,
    marginLeft: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  minusButton: {
    backgroundColor: colors.background.lighter,
    borderRadius: 999,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityTextContainer: {
    marginHorizontal: 16,
    minWidth: 32,
    alignItems: 'center',
  },
  quantityText: {
    color: colors.text.primary,
    fontWeight: 'bold',
    fontSize: 18,
  },
  plusButton: {
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 999,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 999,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBtn: {
    opacity: 0.3,
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
    paddingBottom: 110,
    paddingHorizontal: 24,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconTextGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemCountText: {
    color: colors.text.secondary,
    marginLeft: 8,
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalPriceText: {
    color: colors.text.primary,
    fontWeight: "bold",
    fontSize: 20,
  },
  checkoutButton: {
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
  checkoutText: {
    color: colors.background.DEFAULT,
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 8,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  },
  headerContainer: {
    //paddingHorizontal: 24,
    //paddingBottom: 20,
  },
  emptyHeaderTxt: {
    color: colors.text.primary,
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 20,
    marginTop: 16,
  },
  emptySubtitle: {
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
})