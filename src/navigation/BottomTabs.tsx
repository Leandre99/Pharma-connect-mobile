import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors, styles } from "../shared/styles";
import { Tab } from "../shared/types";
import { bottomTabs } from "./navigationConfig";

type BottomTabsProps = {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  cartCount: number;
  bottomInset: number;
};

export function BottomTabs({ activeTab, setActiveTab, cartCount, bottomInset }: BottomTabsProps) {
  return (
    <View style={[styles.tabs, { bottom: Math.max(10, bottomInset + 8) }]}>
      {bottomTabs.map((tab) => {
        const active = activeTab === tab.id;
        const isCart = tab.id === "orders";
        return (
          <Pressable
            key={tab.id}
            style={[styles.tabButton, active && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <View style={styles.tabIconWrap}>
              <Ionicons
                name={tab.icon}
                size={isCart ? 23 : 21}
                color={active ? colors.tealDark : colors.muted}
              />
              {isCart && cartCount > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
