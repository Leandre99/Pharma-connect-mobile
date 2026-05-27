import { Ionicons } from "@expo/vector-icons";
import { Tab } from "../shared/types";

export const bottomTabs: { id: Tab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "home", label: "Accueil", icon: "home-outline" },
  { id: "search", label: "Recherche", icon: "search-outline" },
  { id: "prescription", label: "Ordonnance", icon: "document-text-outline" },
  { id: "orders", label: "Commandes", icon: "bag-check-outline" },
  { id: "profile", label: "Profil", icon: "person-outline" }
];
