import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { colors, styles } from "../styles";

type PrimaryButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
};

export function PrimaryButton({ icon, label, onPress }: PrimaryButtonProps) {
  return (
    <Pressable style={styles.primaryButton} onPress={onPress}>
      <Ionicons name={icon} size={20} color={colors.white} />
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}
