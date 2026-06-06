import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "../../../shared/styles";
import { styles } from "../../../shared/styles";
import { SettingRow } from "../../../features/profile/components/SettingRow";

export function ProfileScreen({ onLogout }: { onLogout: () => void }) {
  return (
    <View>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>L</Text>
        </View>
        <Text style={styles.profileName}>Leandre</Text>
        <Text style={styles.mutedCenter}>Compte client verifie par telephone</Text>
      </View>

      <View style={styles.profileInfoCard}>
        <View style={styles.profileInfoHeader}>
          <View style={styles.profileInfoIcon}>
            <Ionicons name="medical-outline" size={22} color={colors.tealDark} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.panelTitle}>Profil INH</Text>
            <Text style={styles.muted}>Identite de sante rattachee au compte</Text>
          </View>
          <View style={styles.verifiedPill}>
            <Ionicons name="checkmark-circle" size={15} color={colors.tealDark} />
            <Text style={styles.verifiedPillText}>Actif</Text>
          </View>
        </View>

        <View style={styles.profileGrid}>
          <View style={styles.profileFact}>
            <Text style={styles.profileFactLabel}>Numero INH</Text>
            <Text style={styles.profileFactValue}>INH-229-4581</Text>
          </View>
          <View style={styles.profileFact}>
            <Text style={styles.profileFactLabel}>Telephone</Text>
            <Text style={styles.profileFactValue}>+229 01 90 00 00 00</Text>
          </View>
          <View style={styles.profileFact}>
            <Text style={styles.profileFactLabel}>Ville</Text>
            <Text style={styles.profileFactValue}>Cotonou</Text>
          </View>
          <View style={styles.profileFact}>
            <Text style={styles.profileFactLabel}>Pharmacie favorite</Text>
            <Text style={styles.profileFactValue}>Saint Michel</Text>
          </View>
        </View>
      </View>

      <View style={styles.settingsCard}>
        <SettingRow icon="person-outline" label="Informations personnelles" />
        <SettingRow icon="medkit-outline" label="Dossier INH et allergies" />
        <SettingRow icon="location-outline" label="Adresse de livraison" />
        <SettingRow icon="shield-checkmark-outline" label="Confidentialite et consentements" />
        <SettingRow icon="receipt-outline" label="Historique des ordonnances" />
        <SettingRow icon="card-outline" label="Moyens de paiement" />
      </View>
      <Pressable style={styles.logoutButton} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.red} />
        <Text style={styles.logoutText}>Se deconnecter</Text>
      </Pressable>
    </View>
  );
}
