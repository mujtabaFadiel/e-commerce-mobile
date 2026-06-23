import React, { useEffect, useRef, useState } from 'react';
import {
  Image, ScrollView, StyleSheet,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import SafeScreen from '@/components/SafeScreen';
import ThemedTxt from '../../components/ThemedTxt';
import ProductsGrid from '@/components/productsGrid';
import { colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import api from '@/api/axios';
import { debounce } from 'lodash';

const CATEGORIES = [
  { name: "All", icon: "grid-outline" as const },
  { name: "Electronics", image: require("../../../assets/imgs/electronics.png") },
  { name: "Fashion", image: require("../../../assets/imgs/fashion.png") },
  { name: "Sports", image: require("../../../assets/imgs/sports.png") },
  { name: "Books", image: require("../../../assets/imgs/books.png") },
  { name: "Vehicles", image: require("../../../assets/imgs/car.png") },
];

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  image: string | null;
  category: any;
}


interface ListHeaderProps {
  data: Product[];
  selectedCategory: string;
  filterCategory: (category: any) => void;
  debounceSearch: (text: string) => void;
}

const ListHeader = ({ data, selectedCategory, filterCategory, debounceSearch }: ListHeaderProps) => (
  <View>
    <View style={styles.header}>
      <View style={styles.content}>
        <View>
          <ThemedTxt style={{ fontSize: 30, lineHeight: 36, fontWeight: 'bold' }}>
            Shop
          </ThemedTxt>
          <ThemedTxt 
            style={{ fontSize: 14, lineHeight: 20, color: colors.text.secondary, marginTop: 4 }}>
            Browse all products
          </ThemedTxt>
        </View>
        <TouchableOpacity style={styles.optionsIcon}>
          <Ionicons name='options-outline' color={"#fff"} size={22} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name='search' size={22} color={'#666'} />
        <TextInput
          placeholder='Search for product'
          placeholderTextColor={'#666'}
          onChangeText={debounceSearch}
          style={styles.txtInput}
        />
      </View>
    </View>

    <View style={{ marginBottom: 24 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
      >
        {CATEGORIES.map(category => {
          const isSelected = selectedCategory === category.name;
          return (
            <TouchableOpacity
              key={category.name}
              onPress={() => filterCategory(category)}
              style={[styles.categoryBtn, {
                backgroundColor: isSelected ? colors.primary.DEFAULT : colors.surface.DEFAULT
              }]}
            >
              {category.icon ? (
                <Ionicons 
                  name={category.icon} 
                  size={28} color={isSelected ? '#121212' : '#fff'} 
                />
              ) : (
                <Image 
                  source={category.image} 
                  style={{ width: 32, height: 32 }} 
                  resizeMode='contain' />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>

    <View style={{ 
      marginBottom: 16, paddingHorizontal: 24, flexDirection: 'row', 
      justifyContent: 'space-between', alignItems: 'center' 
    }}>
      <ThemedTxt style={{ fontSize: 16, fontWeight: 'bold' }}>
        Products
      </ThemedTxt>
      <ThemedTxt style={{ fontSize: 12, color: colors.text.secondary }}>
        {data.length} items
      </ThemedTxt>
    </View>
  </View>
);


const ShopeScreen = () => {
  const [data, setData] = useState<Product[]>([]);
  const [displayData, setDisplayData] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSearch, setIsSearch] = useState(false);
  const [searchedData, setSearchedData] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      if (response.data?.data) {
        setData(response.data.data);
        setDisplayData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const filterCategory = (category: any) => {
    if (!category?.name) return;
    setSelectedCategory(category.name);
    setIsSearch(false);

    if (category.name === 'All') {
      setDisplayData(data);
      return;
    }

    const filtered = data.filter((item: any) =>
      item.category?.name?.trim().toLowerCase() === category.name.trim().toLowerCase()
    );
    setDisplayData(filtered);
  };

  const handleSearch = async (text: string) => {
    if (!text.trim()) {
      setIsSearch(false);
      return;
    }
    try {
      const res = await api.get(`/products/by-name/${text}`);
      const result = Array.isArray(res.data) ? res.data : [res.data];
      setSearchedData(result);
      setIsSearch(true);
    } catch (error) {
      console.log('error', error);
    }
  };

  const debounceSearch = useRef(
    debounce((text: string) => handleSearch(text), 500)
  ).current;

  useEffect(() => {
    fetchProducts();
    return () => debounceSearch.cancel();
  }, []);

  return (
    <SafeScreen>
      <ProductsGrid
        products={isSearch ? searchedData : selectedCategory === 'All' ? data : displayData}
        ListHeaderComponent={
          <ListHeader
            data={data}
            selectedCategory={selectedCategory}
            filterCategory={filterCategory}
            debounceSearch={debounceSearch}
          />
        }
      />
    </SafeScreen>
  );
};

export default ShopeScreen;

const styles = StyleSheet.create({
  header: { paddingBottom: 16, paddingTop: 12 },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    marginBottom: 24 },
  optionsIcon: { backgroundColor: colors.surface.DEFAULT, padding: 12, borderRadius: 9999 },
  searchBar: { backgroundColor: colors.surface.DEFAULT, alignItems: 'center', 
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 5, borderRadius: 16 },
  txtInput: { flex: 1, paddingLeft: 12, color: colors.text.primary, fontSize: 16 },
  categoryBtn: { marginEnd: 12, borderRadius: 16, width: 56, height: 56, 
    alignItems: 'center', justifyContent: 'center' },
});