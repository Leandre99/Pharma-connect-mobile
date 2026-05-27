import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { Badge } from "../../../shared/components/feedback/Badge";
import { colors, styles } from "../../../shared/styles";
import { Medicine, Pharmacy } from "../../../shared/types";
import { currency, stockLabel } from "../../../shared/utils";

type MedicineCardProps = {
  medicine: Medicine;
  pharmacies: Pharmacy[];
  onAdd: (medicine: Medicine, pharmacy: Pharmacy) => void;
};

export function MedicineCard({ medicine, pharmacies, onAdd }: MedicineCardProps) {
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
