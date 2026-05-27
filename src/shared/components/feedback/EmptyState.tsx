import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { colors, styles } from "../../styles";

type EmptyStateProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  text: string;
};

export function EmptyState({ icon, title, text }: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name={icon} size={32} color={colors.tealDark} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.mutedCenter}>{text}</Text>
    </View>
  );
}
