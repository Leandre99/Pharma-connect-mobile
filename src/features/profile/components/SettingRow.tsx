import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { colors, styles } from "../../../shared/styles";

type SettingRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

export function SettingRow({ icon, label }: SettingRowProps) {
  return (
    <Pressable style={styles.settingRow}>
      <Ionicons name={icon} size={21} color={colors.tealDark} />
      <Text style={styles.settingLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}
