import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "../theme";
import { Medicine, Pharmacy } from "../types";
import { styles } from "../styles/appStyles";
import { currency } from "../utils/format";
import { stockLabel } from "../utils/stock";
import { Badge } from "./common";

export function MedicineCard({
  medicine,
  pharmacies,
  onAdd
}: {
  medicine: Medicine;
  pharmacies: Pharmacy[];
  onAdd: (medicine: Medicine, pharmacy: Pharmacy) => void;
}) {
  const available = pharmacies
    .map((pharmacy) => ({
      pharmacy,
      inventory: pharmacy.inventory.find((item) => item.medicineId === medicine.id)
    }))
    .filter((entry) => entry.inventory);

  return (
    <View style={styles.medicineCard}>
      <View style={styles.medicineHeader}>
        <View style={styles.flex}>
          <Text style={styles.cardTitle}>{medicine.name}</Text>
          <Text style={styles.muted}>{medicine.molecule} · {medicine.form}</Text>
        </View>
        {medicine.prescriptionRequired && <Badge label="Ordonnance" tone="amber" />}
      </View>

      {available.length === 0 ? (
        <Text style={styles.unavailableText}>Aucune disponibilite trouvee dans cette selection.</Text>
      ) : (
        available.map(({ pharmacy, inventory }) => (
          <View key={pharmacy.id} style={styles.availabilityRow}>
            <View style={styles.flex}>
              <Text style={styles.availabilityName}>{pharmacy.name}</Text>
              <Text style={styles.muted}>{pharmacy.distanceKm.toFixed(1)} km · {stockLabel(inventory!.stock)}</Text>
            </View>
            <Text style={styles.price}>{currency.format(inventory!.price)}</Text>
            <Pressable style={styles.addButton} onPress={() => onAdd(medicine, pharmacy)}>
              <Ionicons name="add" size={18} color={colors.white} />
            </Pressable>
          </View>
        ))
      )}
    </View>
  );
}

export function PharmacyCard({ pharmacy, onPress }: { pharmacy: Pharmacy; onPress: () => void }) {
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
