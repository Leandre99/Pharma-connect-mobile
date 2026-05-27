import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, Text, View } from "react-native";
import { colors } from "../../../shared/styles";
import { Pharmacy } from "../../../shared/types";
import { styles } from "../../../shared/styles";
import { PrimaryButton, SectionTitle } from "../../../shared/components";

export function PrescriptionScreen({
  fileName,
  pharmacies,
  onPick,
  onSelectPharmacy
}: {
  fileName: string | null;
  pharmacies: Pharmacy[];
  onPick: () => void;
  onSelectPharmacy: (pharmacy: Pharmacy) => void;
}) {
  return (
    <View>
      <View style={styles.uploadBox}>
        <View style={styles.uploadIcon}>
          <Ionicons name="document-text-outline" size={32} color={colors.tealDark} />
        </View>
        <Text style={styles.uploadTitle}>{fileName ?? "Ajouter une ordonnance"}</Text>
        <Text style={styles.mutedCenter}>PDF ou image, visible uniquement par la pharmacie choisie.</Text>
        <PrimaryButton icon="cloud-upload-outline" label={fileName ? "Remplacer" : "Uploader"} onPress={onPick} />
      </View>

      <SectionTitle title="Envoyer a une pharmacie" action="Devis" />
      {pharmacies.map((pharmacy) => (
        <Pressable key={pharmacy.id} style={styles.prescriptionPharmacy} onPress={() => onSelectPharmacy(pharmacy)}>
          <View>
            <Text style={styles.cardTitle}>{pharmacy.name}</Text>
            <Text style={styles.muted}>{pharmacy.area} · {pharmacy.distanceKm.toFixed(1)} km</Text>
          </View>
          <Ionicons name="send-outline" size={22} color={colors.tealDark} />
        </Pressable>
      ))}
    </View>
  );
}
