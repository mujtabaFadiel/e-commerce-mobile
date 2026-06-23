import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert
} from 'react-native';
import SafeScreen from '@/components/SafeScreen';
import ThemedTxt from './ThemedTxt';
import { colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/types';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

const emptyImg = 'https://cdni.iconscout.com/illustration/premium/thumb/no-product-illustration-svg-download-png-14657967.png';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

interface ProductsGridProps {
  isLoading?: boolean;
  isError?: boolean;
  products: Product[];
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}


const ProductsGrid = ({
  products,
  isLoading,
  isError,
  ListHeaderComponent }: ProductsGridProps) => {

  const router = useRouter()

  const addToCart = async (item: any) => {
    try {
      const cart = await SecureStore.getItemAsync('cart');
      const cartItems = cart ? JSON.parse(cart) : [];

      const existing = cartItems.find((prod: any) => prod.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cartItems.push({ ...item, quantity: 1 });
      }

      await SecureStore.setItemAsync('cart', JSON.stringify(cartItems));

      Toast.show({
        type: 'success',
        text1: 'Done ',
        text2: `${item.name} added to cart`,
        position: 'bottom', 
        bottomOffset: 60,   
      });

    } catch (error) {
      console.error("Error adding to cart:", error);

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong',
        position: 'bottom',
      });
    }
  };

  const renderItems = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({
        pathname: '/(product)/ProductDetail',
        params: { 
          id: item.id,
          name: item.name,
          image: item.image,
          description: item.description,
          stock: item.stock,
          price: item.price
         }
      })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={item.image ? { uri: item.image } : { uri: emptyImg }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.cardContent}>
        <ThemedTxt style={styles.productName} numberOfLines={1}>{item.name}</ThemedTxt>
        <Text style={styles.productDescription} numberOfLines={1}>{item.description}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>${parseFloat(item.price).toFixed(0)}</Text>
          <Text style={styles.stockText}>({item.stock} left)</Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => addToCart(item)}
          >
            <Ionicons name='add' size={22} color={colors.background.light} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.likebtn}>
        <Ionicons name='heart-outline' size={22} color={colors.primary.light} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={products}           // ← was [] — now uses real data
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItems}
      numColumns={2}
      columnWrapperStyle={styles.columnRow}
      contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 24 }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}   // ← receives header from parent
      ListEmptyComponent={NoProductFound}
    />
  );
};

export default ProductsGrid;

function NoProductFound() {
  return (
    <View
      style={{ paddingVertical: 60, justifyContent: 'center', alignItems: 'center' }}
    >
      <Ionicons name='search-outline' size={48} color={'#666'} />
      <ThemedTxt style={{ fontSize: 16 }}>No products found</ThemedTxt>
      <ThemedTxt style={{ fontSize: 10, color: colors.text.secondary }}>Try adjusting your filters</ThemedTxt>
    </View>
  )
}

const styles = StyleSheet.create({

  //  التعديلات الأساسية لـ Grid الأعمدة المتجاورة:
  columnRow: {
    justifyContent: 'space-between', // توزيع الأعمدة بالتساوي يميناً ويساراً
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.surface.DEFAULT,
    //backgroundColor: '#181528',
    flexDirection: 'column', // تحويل الاتجاه لعمود داخلي
    width: CARD_WIDTH,       // تطبيق العرض المحسوب بدقة
    borderRadius: 16,
    padding: 12,
    position: 'relative'
  },
  imageContainer: {
    backgroundColor: '#181818',
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
    height: 120, // ارتفاع ثابت ومناسب لصور المتجر الشبكي
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    width: '100%',
  },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  productDescription: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary.DEFAULT,
  },
  stockText: {
    fontSize: 11,
    color: colors.text.tertiary,
  },
  btn: {
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 9999,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: 5
  },
  likebtn: {
    //backgroundColor: colors.primary.DEFAULT,
    borderRadius: 9999,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 5,
    end: 5
  }
})