import SafeScreen from "@/components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import {
    View,
    Text,
    Alert,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    StyleSheet,
} from "react-native";
import { colors } from "@/constants/theme";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

const ProductDetailScreen = () => {
    const product = useLocalSearchParams();

    const [inStock, setInStock] = useState(Number(product.stock || 0) > 0);
    const [quantity, setQuantity] = useState(1);

    const getCartData = async () => {
        if (!product.id) return;
        const rawCart = await SecureStore.getItemAsync('cart');
        const currentCart = rawCart ? JSON.parse(rawCart) : [];
        const cartItem = currentCart.find((pro: any) => String(pro.id) === String(product.id));
        
        if (cartItem) {
            setQuantity(cartItem.quantity);
        } else {
            setQuantity(1);
        }
    };

    const handleIncrement = () => {
        const maxStock = Number(product.stock || 0);
        if (quantity < maxStock) {
            setQuantity(prev => prev + 1);
        } else {
            Toast.show({
                type: 'error',
                text1: 'Limit Reached',
                text2: 'Cannot add more than available stock',
                position: 'bottom',
                bottomOffset: 60,
            });
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const addToCart = async () => {
        try {
            if (!inStock) return;

            const cart = await SecureStore.getItemAsync('cart');
            const currentCart = cart ? JSON.parse(cart) : [];

            const existingIndex = currentCart.findIndex((prod: any) => String(prod.id) === String(product.id));
      
            if (existingIndex > -1) {
                currentCart[existingIndex].quantity = quantity;
            } else {
                currentCart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    description: product.description,
                    stock: Number(product.stock || 0),
                    quantity: quantity
                });
            }

            await SecureStore.setItemAsync('cart', JSON.stringify(currentCart));

            Toast.show({
                type: 'success',
                text1: 'Done',
                text2: `${product.name} updated in cart`,
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
                bottomOffset: 60,
            });
        }
    };

    useEffect(() => {
        getCartData();
    }, [product.id]);

    return (
        <SafeScreen>
            <View style={styles.headerAbsoluteRow}>
                <TouchableOpacity
                    style={styles.headerRoundBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                {/* <TouchableOpacity
                    style={styles.headerRoundBtn}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="heart-outline"
                        size={24}
                        color="#FFFFFF"
                    />
                </TouchableOpacity> */}
            </View>

            <ScrollView
                style={styles.mainScroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.galleryWrapper}>
                    <View style={{ width }}>
                        <Image
                            source={product.image}
                            style={styles.galleryImage}
                            contentFit="cover"
                        />
                    </View>
                    <View style={styles.indicatorContainer}>
                        <View style={styles.indicatorDot} />
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.categoryRow}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryTxt}>{product.category || "General"}</Text>
                        </View>
                    </View>

                    <Text style={styles.productTitle}>{product.name}</Text>

                    <View style={styles.metaRow}>
                        <View style={styles.ratingBadge}>
                            <Ionicons name="star" size={16} color="#FFC107" />
                            <Text style={styles.ratingValue}>4.5</Text>
                            <Text style={styles.reviewCount}>(48 reviews)</Text>
                        </View>

                        {inStock ? (
                            <View style={styles.stockStatusRow}>
                                <View style={[styles.statusDot, styles.successDot]} />
                                <Text style={styles.successStatusTxt}>
                                    {product.stock} in stock
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.stockStatusRow}>
                                <View style={[styles.statusDot, styles.dangerDot]} />
                                <Text style={styles.dangerStatusTxt}>Out of Stock</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.priceContainer}>
                        <Text style={styles.priceTxt}>${Number(product.price || 0).toFixed(2)}</Text>
                    </View>

                    <View style={styles.quantitySection}>
                        <Text style={styles.sectionHeading}>Quantity</Text>

                        <View style={styles.quantityControls}>
                            <TouchableOpacity
                                style={styles.quantityBtn}
                                activeOpacity={0.7}
                                disabled={!inStock || quantity <= 1}
                                onPress={handleDecrement}
                            >
                                <Ionicons
                                    name="remove"
                                    size={24}
                                    color={inStock && quantity > 1 ? "#FFFFFF" : "#666"}
                                />
                            </TouchableOpacity>

                            <Text style={styles.quantityValueTxt}>{quantity}</Text>

                            <TouchableOpacity
                                style={styles.quantityBtn}
                                activeOpacity={0.7}
                                disabled={!inStock || quantity >= Number(product.stock || 0)}
                                onPress={handleIncrement}
                            >
                                <Ionicons
                                    name="add"
                                    size={24}
                                    color={inStock && quantity < Number(product.stock || 0) ? "#FFFFFF" : "#666"}
                                />
                            </TouchableOpacity>
                        </View>

                        {quantity >= Number(product.stock || 0) && inStock && (
                            <Text style={styles.warningTxt}>Maximum stock reached</Text>
                        )}
                    </View>

                    <View style={styles.descriptionSection}>
                        <Text style={styles.sectionHeading}>Description</Text>
                        <Text style={styles.descriptionBodyTxt}>{product.description}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomActionBar}>
                <View style={styles.actionBarContent}>
                    <View style={styles.priceTotalWrapper}>
                        <Text style={styles.totalLabel}>Total Price</Text>
                        <Text style={styles.totalPriceValue}>
                            ${(Number(product.price || 0) * quantity).toFixed(2)}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.cartActionButton,
                            !inStock ? styles.cartBtnDisabled : styles.cartBtnActive
                        ]}
                        activeOpacity={0.8}
                        onPress={addToCart}
                        disabled={!inStock}
                    >
                        <Ionicons name="cart" size={24} color={!inStock ? "#666" : "#121212"} />
                        <Text
                            style={[
                                styles.cartBtnTxt,
                                !inStock ? styles.cartBtnTxtDisabled : styles.cartBtnTxtActive
                            ]}
                        >
                            {!inStock ? "Out of Stock" : "Add to Cart"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeScreen>
    );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
    mainScroll: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    headerAbsoluteRow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingHorizontal: 16,
        paddingBottom: 20,
        paddingTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerRoundBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    galleryWrapper: {
        position: 'relative',
    },
    galleryImage: {
        width: width,
        height: 400,
    },
    indicatorContainer: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    indicatorDot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary.DEFAULT,
        width: 24,
    },
    infoContainer: {
        padding: 24,
    },
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryBadge: {
        backgroundColor: 'rgba(29, 185, 84, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 99,
    },
    categoryTxt: {
        color: colors.primary.DEFAULT,
        fontSize: 12,
        fontWeight: 'bold',
    },
    productTitle: {
        color: colors.text.primary,
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface.DEFAULT,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 99,
    },
    ratingValue: {
        color: colors.text.primary,
        fontWeight: 'bold',
        marginLeft: 4,
        marginRight: 8,
        fontSize: 12,
    },
    reviewCount: {
        color: colors.text.secondary,
        fontSize: 12,
    },
    stockStatusRow: {
        marginLeft: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    successDot: {
        backgroundColor: '#22C55E',
    },
    dangerDot: {
        backgroundColor: '#EF4444',
    },
    successStatusTxt: {
        color: '#22C55E',
        fontWeight: '600',
        fontSize: 14,
    },
    dangerStatusTxt: {
        color: '#EF4444',
        fontWeight: '600',
        fontSize: 14,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    priceTxt: {
        color: colors.primary.DEFAULT,
        fontSize: 30,
        fontWeight: 'bold',
    },
    quantitySection: {
        marginBottom: 24,
    },
    sectionHeading: {
        color: colors.text.primary,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityBtn: {
        backgroundColor: colors.surface.DEFAULT,
        borderRadius: 24,
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityValueTxt: {
        color: colors.text.primary,
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 24,
    },
    warningTxt: {
        color: '#F97316',
        fontSize: 14,
        marginTop: 8,
    },
    descriptionSection: {
        marginBottom: 32,
    },
    descriptionBodyTxt: {
        color: colors.text.secondary,
        fontSize: 16,
        lineHeight: 24,
    },
    bottomActionBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(18, 18, 18, 0.95)',
        borderTopWidth: 1,
        borderTopColor: colors.surface.DEFAULT,
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 32,
    },
    actionBarContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
  },
    priceTotalWrapper: {
        flex: 1,
    },
    totalLabel: {
        color: colors.text.secondary,
        fontSize: 12,
        marginBottom: 4,
    },
    totalPriceValue: {
        color: colors.primary.DEFAULT,
        fontSize: 15,
        fontWeight: 'bold',
    },
    cartActionButton: {
        borderRadius: 16,
        paddingHorizontal: 32,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartBtnActive: {
        backgroundColor: colors.primary.DEFAULT,
    },
    cartBtnDisabled: {
        backgroundColor: colors.surface.DEFAULT,
    },
    cartBtnTxt: {
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 8,
    },
    cartBtnTxtActive: {
        color: colors.background.DEFAULT,
    },
    cartBtnTxtDisabled: {
        color: colors.text.secondary,
    }
});