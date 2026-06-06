import { Ionicons } from "@expo/vector-icons";
import { Tab } from "../shared/types";

export const bottomTabs: { id: Tab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "home", label: "Accueil", icon: "home-outline" },
  { id: "search", label: "Chercher", icon: "search-outline" },
  { id: "prescription", label: "Ordo", icon: "document-text-outline" },
  { id: "orders", label: "Panier", icon: "bag-handle-outline" },
  { id: "profile", label: "Profil", icon: "person-outline" }
];
