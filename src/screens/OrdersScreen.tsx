import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "../theme";
import { CartItem, Order, PaymentMode } from "../types";
import { styles } from "../styles/appStyles";
import { EmptyState, PrimaryButton, SectionTitle, SegmentButton, StatusPill } from "../components/common";
import { currency } from "../utils/format";

export function OrdersScreen({
  cart,
  orders,
  paymentMode,
  total,
  setPaymentMode,
  onQuantity,
  onPlaceOrder
}: {
  cart: CartItem[];
  orders: Order[];
  paymentMode: PaymentMode;
  total: number;
  setPaymentMode: (mode: PaymentMode) => void;
  onQuantity: (index: number, delta: number) => void;
  onPlaceOrder: () => void;
}) {
  return (
    <View>
      <SectionTitle title="Panier" action={`${cart.length}`} />
      {cart.length === 0 ? (
        <EmptyState icon="bag-outline" title="Votre panier est vide" text="Ajoutez des medicaments depuis la recherche." />
      ) : (
        <View style={styles.orderCard}>
          {cart.map((item, index) => (
            <View key={`${item.medicine.id}-${item.pharmacy.id}`} style={styles.cartRow}>
              <View style={styles.flex}>
                <Text style={styles.cardTitle}>{item.medicine.name}</Text>
                <Text style={styles.muted}>{item.pharmacy.name}</Text>
                <Text style={styles.price}>{currency.format(item.price)}</Text>
              </View>
              <View style={styles.stepper}>
                <Pressable onPress={() => onQuantity(index, -1)} style={styles.stepperButton}>
                  <Ionicons name="remove" size={16} color={colors.tealDark} />
                </Pressable>
                <Text style={styles.stepperText}>{item.quantity}</Text>
                <Pressable onPress={() => onQuantity(index, 1)} style={styles.stepperButton}>
                  <Ionicons name="add" size={16} color={colors.tealDark} />
                </Pressable>
              </View>
            </View>
          ))}

          <Text style={styles.paymentLabel}>Mode de paiement</Text>
          <View style={styles.segment}>
            <SegmentButton active={paymentMode === "pickup"} label="Sur place" onPress={() => setPaymentMode("pickup")} />
            <SegmentButton active={paymentMode === "online"} label="En ligne" onPress={() => setPaymentMode("online")} />
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total estime</Text>
            <Text style={styles.totalValue}>{currency.format(total)}</Text>
          </View>
          <PrimaryButton icon="checkmark-circle-outline" label="Valider la commande" onPress={onPlaceOrder} />
        </View>
      )}

      <SectionTitle title="Commandes" action="Suivi" />
      {orders.map((order) => (
        <View key={order.id} style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.cardTitle}>{order.id}</Text>
              <Text style={styles.muted}>{order.pharmacyName}</Text>
            </View>
            <StatusPill status={order.status} />
          </View>
          <View style={styles.pickupCode}>
            <Text style={styles.pickupCodeLabel}>Code retrait</Text>
            <Text style={styles.pickupCodeText}>{order.pickupCode}</Text>
          </View>
          <Text style={styles.price}>{currency.format(order.total)} · {order.paymentMode === "online" ? "Paiement en ligne" : "Paiement sur place"}</Text>
        </View>
      ))}
    </View>
  );
}
