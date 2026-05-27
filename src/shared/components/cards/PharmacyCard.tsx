import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors, styles } from "../../styles";
import { Pharmacy } from "../../types";

type PharmacyCardProps = {
  pharmacy: Pharmacy;
  onPress: () => void;
};

export function PharmacyCard({ pharmacy, onPress }: PharmacyCardProps) {
  return (
    <Pressable style={styles.pharmacyCard} onPress={onPress}>
      <View style={styles.pharmacyIcon}>
        <Ionicons name="storefront-outline" size={24} color={colors.tealDark} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.cardTitle}>{pharmacy.name}</Text>
        <Text style={styles.muted}>{pharmacy.address}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{pharmacy.distanceKm.toFixed(1)} km</Text>
          <Text style={styles.metaText}>Ouvert jusqu'a {pharmacy.openUntil}</Text>
          <Text style={styles.metaText}>{pharmacy.rating.toFixed(1)}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </Pressable>
  );
}
