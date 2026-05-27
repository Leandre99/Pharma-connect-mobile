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
      <View style={styles.settingsCard}>
        <SettingRow icon="person-outline" label="Informations personnelles" />
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
