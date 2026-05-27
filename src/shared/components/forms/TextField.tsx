import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { TextInput, View } from "react-native";
import { colors, styles } from "../../styles";

type TextFieldProps = ComponentProps<typeof TextInput> & {
  icon: keyof typeof Ionicons.glyphMap;
};

export function TextField({ icon, ...props }: TextFieldProps) {
  return (
    <View style={styles.inputBox}>
      <Ionicons name={icon} size={20} color={colors.muted} />
      <TextInput {...props} placeholderTextColor={colors.muted} style={styles.input} />
    </View>
  );
}
