import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "../../../shared/styles";
import { Pharmacy } from "../../../shared/types";
import { styles } from "../../../shared/styles";
import { PharmacyCard } from "../../../shared/components";
import { SectionTitle } from "../../../shared/components";

export function HomeScreen({
  locationEnabled,
  nearbyPharmacies,
  onEnableLocation,
  onOpenSearch,
  onSelectPharmacy
}: {
  locationEnabled: boolean;
  nearbyPharmacies: Pharmacy[];
  onEnableLocation: () => void;
  onOpenSearch: () => void;
  onSelectPharmacy: (pharmacy: Pharmacy) => void;
}) {
  return (
    <View>
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Votre pharmacie, avant meme d'y aller.</Text>
          <Text style={styles.heroText}>Verifiez la disponibilite, envoyez une ordonnance et recuperez quand c'est pret.</Text>
        </View>
        <Pressable style={styles.heroAction} onPress={onOpenSearch}>
          <Ionicons name="search" size={20} color={colors.white} />
          <Text style={styles.heroActionText}>Rechercher</Text>
        </Pressable>
      </View>

      <View style={styles.locationPanel}>
        <View style={styles.locationIcon}>
          <Ionicons name="navigate-outline" size={22} color={colors.tealDark} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.panelTitle}>Pharmacies proches</Text>
          <Text style={styles.muted}>{locationEnabled ? "Position activee" : "Activez la position pour trier autour de vous."}</Text>
        </View>
        <Pressable style={styles.smallButton} onPress={onEnableLocation}>
          <Text style={styles.smallButtonText}>{locationEnabled ? "Actif" : "Activer"}</Text>
        </Pressable>
      </View>

      <SectionTitle title="A proximite" action="Tout voir" />
      {nearbyPharmacies.slice(0, 3).map((pharmacy) => (
        <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} onPress={() => onSelectPharmacy(pharmacy)} />
      ))}
    </View>
  );
}
