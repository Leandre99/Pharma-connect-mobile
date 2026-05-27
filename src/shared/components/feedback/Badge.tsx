import { Text, View } from "react-native";
import { styles } from "../../styles";

type BadgeProps = {
  label: string;
  tone: "amber" | "blue";
};

export function Badge({ label, tone }: BadgeProps) {
  return (
    <View style={[styles.badge, tone === "amber" ? styles.badgeAmber : styles.badgeBlue]}>
      <Text style={[styles.badgeText, tone === "amber" ? styles.badgeTextAmber : styles.badgeTextBlue]}>
        {label}
      </Text>
    </View>
  );
}
