import { Text, View } from "react-native";
import { styles } from "../styles";

type SectionTitleProps = {
  title: string;
  action: string;
};

export function SectionTitle({ title, action }: SectionTitleProps) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionText}>{title}</Text>
      <Text style={styles.sectionAction}>{action}</Text>
    </View>
  );
}
