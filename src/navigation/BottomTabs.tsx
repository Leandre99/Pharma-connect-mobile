import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors, styles } from "../shared/styles";
import { Tab } from "../shared/types";
import { bottomTabs } from "./navigationConfig";

type BottomTabsProps = {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
};

export function BottomTabs({ activeTab, setActiveTab }: BottomTabsProps) {
  return (
    <View style={styles.tabs}>
      {bottomTabs.map((tab) => {
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
