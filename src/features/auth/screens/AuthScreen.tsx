import { Ionicons } from "@expo/vector-icons";
import { KeyboardAvoidingView, Platform, SafeAreaView, Text, View } from "react-native";
import { colors } from "../../../shared/styles";
import { AuthMode } from "../../../shared/types";
import { styles } from "../../../shared/styles";
import { PrimaryButton, SegmentButton, TextField } from "../../../shared/components";

type AuthScreenProps = {
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  onSubmit: () => void;
};

export function AuthScreen({ authMode, setAuthMode, onSubmit }: AuthScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.authScreen}
      >
        <View style={styles.brandMark}>
          <Ionicons name="medical" size={30} color={colors.white} />
        </View>
        <Text style={styles.brandTitle}>PharmaConnect</Text>
        <Text style={styles.brandSubtitle}>Trouvez, reservez, recuperez vos medicaments en pharmacie.</Text>

        <View style={styles.authCard}>
          <View style={styles.segment}>
            <SegmentButton active={authMode === "login"} label="Connexion" onPress={() => setAuthMode("login")} />
            <SegmentButton active={authMode === "register"} label="Inscription" onPress={() => setAuthMode("register")} />
          </View>

          {authMode === "register" && <TextField icon="person-outline" placeholder="Nom complet" />}
          <TextField icon="call-outline" placeholder="Numero de telephone" keyboardType="phone-pad" />
          <TextField icon="lock-closed-outline" placeholder="Mot de passe" secureTextEntry />
          {authMode === "register" && <TextField icon="location-outline" placeholder="Quartier ou ville" />}

          <PrimaryButton
            icon={authMode === "login" ? "log-in-outline" : "person-add-outline"}
            label={authMode === "login" ? "Se connecter" : "Creer mon compte"}
            onPress={onSubmit}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
