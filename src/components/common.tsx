import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { colors } from "../theme";
import { Order } from "../types";
import { styles } from "../styles/appStyles";

export function SearchInput({
  value,
  onChangeText,
  placeholder
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.searchBox}>
      <Ionicons name="search" size={20} color={colors.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={styles.searchInput}
      />
    </View>
  );
}

export function Input(props: ComponentProps<typeof TextInput> & { icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={styles.inputBox}>
      <Ionicons name={props.icon} size={20} color={colors.muted} />
      <TextInput
        {...props}
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
    </View>
  );
}

export function PrimaryButton({
  icon,
  label,
  onPress
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.primaryButton} onPress={onPress}>
      <Ionicons name={icon} size={20} color={colors.white} />
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function SegmentButton({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable style={[styles.segmentButton, active && styles.segmentButtonActive]} onPress={onPress}>
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function SectionTitle({ title, action }: { title: string; action: string }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionText}>{title}</Text>
      <Text style={styles.sectionAction}>{action}</Text>
    </View>
  );
}

export function Badge({ label, tone }: { label: string; tone: "amber" | "blue" }) {
  return (
    <View style={[styles.badge, tone === "amber" ? styles.badgeAmber : styles.badgeBlue]}>
      <Text style={[styles.badgeText, tone === "amber" ? styles.badgeTextAmber : styles.badgeTextBlue]}>{label}</Text>
    </View>
  );
}

export function StatusPill({ status }: { status: Order["status"] }) {
  const labelMap: Record<Order["status"], string> = {
    pending: "En attente",
    confirmed: "Confirmee",
    ready: "Prete",
    picked: "Retiree"
  };
  return <Badge label={labelMap[status]} tone={status === "ready" ? "blue" : "amber"} />;
}

export function EmptyState({ icon, title, text }: { icon: keyof typeof Ionicons.glyphMap; title: string; text: string }) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name={icon} size={32} color={colors.tealDark} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.mutedCenter}>{text}</Text>
    </View>
  );
}
