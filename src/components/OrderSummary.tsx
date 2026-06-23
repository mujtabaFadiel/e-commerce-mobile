import { View, Text, StyleSheet } from "react-native";
import { colors } from '@/constants/theme'

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export default function OrderSummary({ subtotal, shipping, tax, total }: OrderSummaryProps) {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.cardContainer}>
        <Text style={styles.headerTitle}>Summary</Text>

        <View style={styles.rowsWrapper}>
          <View style={styles.row}>
            <Text style={styles.labelSecondary}>Subtotal</Text>
            <Text style={styles.valuePrimary}>${subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelSecondary}>Shipping</Text>
            <Text style={styles.valuePrimary}>${shipping.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelSecondary}>Tax</Text>
            <Text style={styles.valuePrimary}>${tax.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  cardContainer: {
    backgroundColor: colors.surface.DEFAULT,
    borderRadius: 24,
    padding: 20,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  rowsWrapper: {
    flexDirection: 'column',
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelSecondary: {
    color: colors.text.secondary,
    fontSize: 16,
  },
  valuePrimary: {
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.background.lighter,
    marginVertical: 4,
  },
  totalLabel: {
    color: colors.text.primary,
    fontWeight: 'bold',
    fontSize: 18,
  },
  totalValue: {
    color: colors.primary.DEFAULT,
    fontWeight: 'bold',
    fontSize: 20,
  },
});