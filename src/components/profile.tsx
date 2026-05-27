import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { colors } from "../theme";
import { styles } from "../styles/appStyles";

export function SettingRow({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <Pressable style={styles.settingRow}>
      <Ionicons name={icon} size={21} color={colors.tealDark} />
      <Text style={styles.settingLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}
