import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors, styles } from "../shared/styles";

type AppHeaderProps = {
  cartCount: number;
  onCartPress: () => void;
};

export function AppHeader({ cartCount, onCartPress }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.hello}>Bonjour, Leandre</Text>
        <Text style={styles.headerTitle}>De quoi avez-vous besoin ?</Text>
      </View>
      <Pressable style={styles.cartButton} onPress={onCartPress}>
        <Ionicons name="bag-outline" size={22} color={colors.tealDark} />
        {cartCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartCount}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}
