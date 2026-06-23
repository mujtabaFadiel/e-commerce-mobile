import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import SafeScreen from '@/components/SafeScreen'
import { colors } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const wishlist = () => {

  const router = useRouter()
  return (
    <SafeScreen>
      {/*Header*/}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Wishlist</Text>

        <Text style={styles.itemCount}>
          2 items
        </Text>
      </View>
    </SafeScreen>
  )
}

export default wishlist

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderColor: colors.surface.DEFAULT,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  itemCount: {
    color: colors.text.secondary,
    fontSize: 12,
    marginLeft: 'auto', // يُحاكي ml-auto لدفع العنصر إلى أقصى اليمين
  },
})