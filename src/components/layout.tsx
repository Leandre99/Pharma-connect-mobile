import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "../theme";
import { Tab } from "../types";
import { styles } from "../styles/appStyles";

export function Header({ cartCount, onCartPress }: { cartCount: number; onCartPress: () => void }) {
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

export function BottomTabs({ activeTab, setActiveTab }: { activeTab: Tab; setActiveTab: (tab: Tab) => void }) {
  const tabs: { id: Tab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: "home", label: "Accueil", icon: "home-outline" },
    { id: "search", label: "Recherche", icon: "search-outline" },
    { id: "prescription", label: "Ordonnance", icon: "document-text-outline" },
    { id: "orders", label: "Commandes", icon: "bag-check-outline" },
    { id: "profile", label: "Profil", icon: "person-outline" }
  ];

  return (
    <View style={styles.tabs}>
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <Pressable key={tab.id} style={styles.tabButton} onPress={() => setActiveTab(tab.id)}>
            <Ionicons name={tab.icon} size={21} color={active ? colors.tealDark : colors.muted} />
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
