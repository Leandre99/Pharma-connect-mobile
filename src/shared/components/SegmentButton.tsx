import { Pressable, Text } from "react-native";
import { styles } from "../styles";

type SegmentButtonProps = {
  active: boolean;
  label: string;
  onPress: () => void;
};

export function SegmentButton({ active, label, onPress }: SegmentButtonProps) {
  return (
    <Pressable style={[styles.segmentButton, active && styles.segmentButtonActive]} onPress={onPress}>
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{label}</Text>
    </Pressable>
  );
}
