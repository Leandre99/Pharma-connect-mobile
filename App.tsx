import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import type { ComponentProps } from "react";
import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { medicines, pharmacies, sampleOrders } from "./src/data/mock";
import { colors, shadow } from "./src/theme";
import { CartItem, Medicine, Order, PaymentMode, Pharmacy, StockLevel } from "./src/types";

type Tab = "home" | "search" | "prescription" | "orders" | "profile";
type AuthMode = "login" | "register";

const currency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0
});

export default function App() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [query, setQuery] = useState("");
  const [pharmacyQuery, setPharmacyQuery] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("pickup");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState<string | null>(null);

  const nearbyPharmacies = useMemo(
    () => [...pharmacies].sort((a, b) => a.distanceKm - b.distanceKm),
    []
  );

  const filteredMedicines = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return medicines;
    return medicines.filter((medicine) =>
      [medicine.name, medicine.molecule, medicine.category].some((value) =>
        value.toLowerCase().includes(normalized)
      )
    );
  }, [query]);

  const filteredPharmacies = useMemo(() => {
    const normalized = pharmacyQuery.trim().toLowerCase();
    if (!normalized) return nearbyPharmacies;
    return nearbyPharmacies.filter((pharmacy) =>
      [pharmacy.name, pharmacy.area, pharmacy.address].some((value) =>
        value.toLowerCase().includes(normalized)
      )
    );
  }, [nearbyPharmacies, pharmacyQuery]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function enableLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Position non activee", "Vous pouvez toujours rechercher une pharmacie par nom ou quartier.");
      return;
    }

    await Location.getCurrentPositionAsync({});
    setLocationEnabled(true);
  }

  async function pickPrescription() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      copyToCacheDirectory: true
    });

    if (!result.canceled) {
      setPrescriptionFile(result.assets[0]?.name ?? "Ordonnance ajoutee");
    }
  }

  function addToCart(medicine: Medicine, pharmacy: Pharmacy) {
    const inventory = pharmacy.inventory.find((item) => item.medicineId === medicine.id);
    if (!inventory || inventory.stock === "unavailable") return;

    if (medicine.prescriptionRequired && !prescriptionFile) {
      Alert.alert(
        "Ordonnance requise",
        "Ajoutez votre ordonnance avant de reserver ce medicament."
      );
      setActiveTab("prescription");
      return;
    }

    setCart((current) => {
      const existing = current.find(
        (item) => item.medicine.id === medicine.id && item.pharmacy.id === pharmacy.id
      );
      if (existing) {
        return current.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { medicine, pharmacy, price: inventory.price, quantity: 1 }];
    });
  }

  function updateQuantity(index: number, delta: number) {
    setCart((current) =>
      current
        .map((item, itemIndex) =>
          itemIndex === index ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function placeOrder() {
    if (cart.length === 0) {
      Alert.alert("Panier vide", "Ajoutez au moins un produit avant de valider.");
      return;
    }

    const pharmacyNames = Array.from(new Set(cart.map((item) => item.pharmacy.name))).join(", ");
    const newOrder: Order = {
      id: `CMD-${Math.floor(1000 + Math.random() * 9000)}`,
      pharmacyName: pharmacyNames,
      status: "pending",
      total: cartTotal,
      paymentMode,
      pickupCode: `PC-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setOrders((current) => [newOrder, ...current]);
    setCart([]);
    setActiveTab("orders");
  }

  if (!isAuthed) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
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

            {authMode === "register" && <Input icon="person-outline" placeholder="Nom complet" />}
            <Input icon="call-outline" placeholder="Numero de telephone" keyboardType="phone-pad" />
            <Input icon="lock-closed-outline" placeholder="Mot de passe" secureTextEntry />
            {authMode === "register" && <Input icon="location-outline" placeholder="Quartier ou ville" />}

            <PrimaryButton
              icon={authMode === "login" ? "log-in-outline" : "person-add-outline"}
              label={authMode === "login" ? "Se connecter" : "Creer mon compte"}
              onPress={() => setIsAuthed(true)}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.appShell}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Header cartCount={cart.length} onCartPress={() => setActiveTab("orders")} />

          {activeTab === "home" && (
            <HomeScreen
              locationEnabled={locationEnabled}
              nearbyPharmacies={nearbyPharmacies}
              onEnableLocation={enableLocation}
              onOpenSearch={() => setActiveTab("search")}
              onSelectPharmacy={(pharmacy) => {
                setSelectedPharmacy(pharmacy);
                setActiveTab("search");
              }}
            />
          )}

          {activeTab === "search" && (
            <SearchScreen
              query={query}
              setQuery={setQuery}
              pharmacyQuery={pharmacyQuery}
              setPharmacyQuery={setPharmacyQuery}
              filteredMedicines={filteredMedicines}
              filteredPharmacies={filteredPharmacies}
              selectedPharmacy={selectedPharmacy}
              setSelectedPharmacy={setSelectedPharmacy}
              onAdd={addToCart}
            />
          )}

          {activeTab === "prescription" && (
            <PrescriptionScreen
              fileName={prescriptionFile}
              pharmacies={nearbyPharmacies}
              onPick={pickPrescription}
              onSelectPharmacy={(pharmacy) => {
                setSelectedPharmacy(pharmacy);
                Alert.alert("Demande envoyee", `${pharmacy.name} recevra votre ordonnance pour verifier prix et disponibilite.`);
              }}
            />
          )}

          {activeTab === "orders" && (
            <OrdersScreen
              cart={cart}
              orders={orders}
              paymentMode={paymentMode}
              total={cartTotal}
              setPaymentMode={setPaymentMode}
              onQuantity={updateQuantity}
              onPlaceOrder={placeOrder}
            />
          )}

          {activeTab === "profile" && (
            <ProfileScreen
              onLogout={() => {
                setIsAuthed(false);
                setActiveTab("home");
              }}
            />
          )}
        </ScrollView>

        <BottomTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>
    </SafeAreaView>
  );
}

function Header({ cartCount, onCartPress }: { cartCount: number; onCartPress: () => void }) {
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

function HomeScreen({
  locationEnabled,
  nearbyPharmacies,
  onEnableLocation,
  onOpenSearch,
  onSelectPharmacy
}: {
  locationEnabled: boolean;
  nearbyPharmacies: Pharmacy[];
  onEnableLocation: () => void;
  onOpenSearch: () => void;
  onSelectPharmacy: (pharmacy: Pharmacy) => void;
}) {
  return (
    <View>
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Votre pharmacie, avant meme d'y aller.</Text>
          <Text style={styles.heroText}>Verifiez la disponibilite, envoyez une ordonnance et recuperez quand c'est pret.</Text>
        </View>
        <Pressable style={styles.heroAction} onPress={onOpenSearch}>
          <Ionicons name="search" size={20} color={colors.white} />
          <Text style={styles.heroActionText}>Rechercher</Text>
        </Pressable>
      </View>

      <View style={styles.locationPanel}>
        <View style={styles.locationIcon}>
          <Ionicons name="navigate-outline" size={22} color={colors.tealDark} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.panelTitle}>Pharmacies proches</Text>
          <Text style={styles.muted}>{locationEnabled ? "Position activee" : "Activez la position pour trier autour de vous."}</Text>
        </View>
        <Pressable style={styles.smallButton} onPress={onEnableLocation}>
          <Text style={styles.smallButtonText}>{locationEnabled ? "Actif" : "Activer"}</Text>
        </Pressable>
      </View>

      <SectionTitle title="A proximite" action="Tout voir" />
      {nearbyPharmacies.slice(0, 3).map((pharmacy) => (
        <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} onPress={() => onSelectPharmacy(pharmacy)} />
      ))}
    </View>
  );
}

function SearchScreen({
  query,
  setQuery,
  pharmacyQuery,
  setPharmacyQuery,
  filteredMedicines,
  filteredPharmacies,
  selectedPharmacy,
  setSelectedPharmacy,
  onAdd
}: {
  query: string;
  setQuery: (value: string) => void;
  pharmacyQuery: string;
  setPharmacyQuery: (value: string) => void;
  filteredMedicines: Medicine[];
  filteredPharmacies: Pharmacy[];
  selectedPharmacy: Pharmacy | null;
  setSelectedPharmacy: (value: Pharmacy | null) => void;
  onAdd: (medicine: Medicine, pharmacy: Pharmacy) => void;
}) {
  return (
    <View>
      <SearchInput value={query} onChangeText={setQuery} placeholder="Rechercher un medicament" />
      <SearchInput value={pharmacyQuery} onChangeText={setPharmacyQuery} placeholder="Chercher une pharmacie ou un quartier" />

      <SectionTitle title="Choisir une pharmacie" action={selectedPharmacy ? "Changer" : "Libre"} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pharmacyRail}>
        {filteredPharmacies.map((pharmacy) => (
          <Pressable
            key={pharmacy.id}
            style={[styles.pharmacyPill, selectedPharmacy?.id === pharmacy.id && styles.pharmacyPillActive]}
            onPress={() => setSelectedPharmacy(selectedPharmacy?.id === pharmacy.id ? null : pharmacy)}
          >
            <Text style={[styles.pharmacyPillName, selectedPharmacy?.id === pharmacy.id && styles.pharmacyPillNameActive]}>
              {pharmacy.name}
            </Text>
            <Text style={styles.pharmacyPillMeta}>{pharmacy.distanceKm.toFixed(1)} km</Text>
          </Pressable>
        ))}
      </ScrollView>

      <SectionTitle title="Medicaments" action={`${filteredMedicines.length}`} />
      {filteredMedicines.map((medicine) => {
        const pharmaciesToShow = selectedPharmacy ? [selectedPharmacy] : filteredPharmacies;
        return (
          <MedicineCard
            key={medicine.id}
            medicine={medicine}
            pharmacies={pharmaciesToShow}
            onAdd={onAdd}
          />
        );
      })}
    </View>
  );
}

function PrescriptionScreen({
  fileName,
  pharmacies,
  onPick,
  onSelectPharmacy
}: {
  fileName: string | null;
  pharmacies: Pharmacy[];
  onPick: () => void;
  onSelectPharmacy: (pharmacy: Pharmacy) => void;
}) {
  return (
    <View>
      <View style={styles.uploadBox}>
        <View style={styles.uploadIcon}>
          <Ionicons name="document-text-outline" size={32} color={colors.tealDark} />
        </View>
        <Text style={styles.uploadTitle}>{fileName ?? "Ajouter une ordonnance"}</Text>
        <Text style={styles.mutedCenter}>PDF ou image, visible uniquement par la pharmacie choisie.</Text>
        <PrimaryButton icon="cloud-upload-outline" label={fileName ? "Remplacer" : "Uploader"} onPress={onPick} />
      </View>

      <SectionTitle title="Envoyer a une pharmacie" action="Devis" />
      {pharmacies.map((pharmacy) => (
        <Pressable key={pharmacy.id} style={styles.prescriptionPharmacy} onPress={() => onSelectPharmacy(pharmacy)}>
          <View>
            <Text style={styles.cardTitle}>{pharmacy.name}</Text>
            <Text style={styles.muted}>{pharmacy.area} · {pharmacy.distanceKm.toFixed(1)} km</Text>
          </View>
          <Ionicons name="send-outline" size={22} color={colors.tealDark} />
        </Pressable>
      ))}
    </View>
  );
}

function OrdersScreen({
  cart,
  orders,
  paymentMode,
  total,
  setPaymentMode,
  onQuantity,
  onPlaceOrder
}: {
  cart: CartItem[];
  orders: Order[];
  paymentMode: PaymentMode;
  total: number;
  setPaymentMode: (mode: PaymentMode) => void;
  onQuantity: (index: number, delta: number) => void;
  onPlaceOrder: () => void;
}) {
  return (
    <View>
      <SectionTitle title="Panier" action={`${cart.length}`} />
      {cart.length === 0 ? (
        <EmptyState icon="bag-outline" title="Votre panier est vide" text="Ajoutez des medicaments depuis la recherche." />
      ) : (
        <View style={styles.orderCard}>
          {cart.map((item, index) => (
            <View key={`${item.medicine.id}-${item.pharmacy.id}`} style={styles.cartRow}>
              <View style={styles.flex}>
                <Text style={styles.cardTitle}>{item.medicine.name}</Text>
                <Text style={styles.muted}>{item.pharmacy.name}</Text>
                <Text style={styles.price}>{currency.format(item.price)}</Text>
              </View>
              <View style={styles.stepper}>
                <Pressable onPress={() => onQuantity(index, -1)} style={styles.stepperButton}>
                  <Ionicons name="remove" size={16} color={colors.tealDark} />
                </Pressable>
                <Text style={styles.stepperText}>{item.quantity}</Text>
                <Pressable onPress={() => onQuantity(index, 1)} style={styles.stepperButton}>
                  <Ionicons name="add" size={16} color={colors.tealDark} />
                </Pressable>
              </View>
            </View>
          ))}

          <Text style={styles.paymentLabel}>Mode de paiement</Text>
          <View style={styles.segment}>
            <SegmentButton active={paymentMode === "pickup"} label="Sur place" onPress={() => setPaymentMode("pickup")} />
            <SegmentButton active={paymentMode === "online"} label="En ligne" onPress={() => setPaymentMode("online")} />
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total estime</Text>
            <Text style={styles.totalValue}>{currency.format(total)}</Text>
          </View>
          <PrimaryButton icon="checkmark-circle-outline" label="Valider la commande" onPress={onPlaceOrder} />
        </View>
      )}

      <SectionTitle title="Commandes" action="Suivi" />
      {orders.map((order) => (
        <View key={order.id} style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.cardTitle}>{order.id}</Text>
              <Text style={styles.muted}>{order.pharmacyName}</Text>
            </View>
            <StatusPill status={order.status} />
          </View>
          <View style={styles.pickupCode}>
            <Text style={styles.pickupCodeLabel}>Code retrait</Text>
            <Text style={styles.pickupCodeText}>{order.pickupCode}</Text>
          </View>
          <Text style={styles.price}>{currency.format(order.total)} · {order.paymentMode === "online" ? "Paiement en ligne" : "Paiement sur place"}</Text>
        </View>
      ))}
    </View>
  );
}

function ProfileScreen({ onLogout }: { onLogout: () => void }) {
  return (
    <View>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>L</Text>
        </View>
        <Text style={styles.profileName}>Leandre</Text>
        <Text style={styles.mutedCenter}>Compte client verifie par telephone</Text>
      </View>
      <View style={styles.settingsCard}>
        <SettingRow icon="person-outline" label="Informations personnelles" />
        <SettingRow icon="shield-checkmark-outline" label="Confidentialite et consentements" />
        <SettingRow icon="receipt-outline" label="Historique des ordonnances" />
        <SettingRow icon="card-outline" label="Moyens de paiement" />
      </View>
      <Pressable style={styles.logoutButton} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.red} />
        <Text style={styles.logoutText}>Se deconnecter</Text>
      </Pressable>
    </View>
  );
}

function MedicineCard({
  medicine,
  pharmacies,
  onAdd
}: {
  medicine: Medicine;
  pharmacies: Pharmacy[];
  onAdd: (medicine: Medicine, pharmacy: Pharmacy) => void;
}) {
  const available = pharmacies
    .map((pharmacy) => ({
      pharmacy,
      inventory: pharmacy.inventory.find((item) => item.medicineId === medicine.id)
    }))
    .filter((entry) => entry.inventory);

  return (
    <View style={styles.medicineCard}>
      <View style={styles.medicineHeader}>
        <View style={styles.flex}>
          <Text style={styles.cardTitle}>{medicine.name}</Text>
          <Text style={styles.muted}>{medicine.molecule} · {medicine.form}</Text>
        </View>
        {medicine.prescriptionRequired && <Badge label="Ordonnance" tone="amber" />}
      </View>

      {available.length === 0 ? (
        <Text style={styles.unavailableText}>Aucune disponibilite trouvee dans cette selection.</Text>
      ) : (
        available.map(({ pharmacy, inventory }) => (
          <View key={pharmacy.id} style={styles.availabilityRow}>
            <View style={styles.flex}>
              <Text style={styles.availabilityName}>{pharmacy.name}</Text>
              <Text style={styles.muted}>{pharmacy.distanceKm.toFixed(1)} km · {stockLabel(inventory!.stock)}</Text>
            </View>
            <Text style={styles.price}>{currency.format(inventory!.price)}</Text>
            <Pressable style={styles.addButton} onPress={() => onAdd(medicine, pharmacy)}>
              <Ionicons name="add" size={18} color={colors.white} />
            </Pressable>
          </View>
        ))
      )}
    </View>
  );
}

function PharmacyCard({ pharmacy, onPress }: { pharmacy: Pharmacy; onPress: () => void }) {
  return (
    <Pressable style={styles.pharmacyCard} onPress={onPress}>
      <View style={styles.pharmacyIcon}>
        <Ionicons name="storefront-outline" size={24} color={colors.tealDark} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.cardTitle}>{pharmacy.name}</Text>
        <Text style={styles.muted}>{pharmacy.address}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{pharmacy.distanceKm.toFixed(1)} km</Text>
          <Text style={styles.metaText}>Ouvert jusqu'a {pharmacy.openUntil}</Text>
          <Text style={styles.metaText}>{pharmacy.rating.toFixed(1)}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </Pressable>
  );
}

function BottomTabs({ activeTab, setActiveTab }: { activeTab: Tab; setActiveTab: (tab: Tab) => void }) {
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

function SearchInput({
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

function Input(props: ComponentProps<typeof TextInput> & { icon: keyof typeof Ionicons.glyphMap }) {
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

function PrimaryButton({
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

function SegmentButton({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable style={[styles.segmentButton, active && styles.segmentButtonActive]} onPress={onPress}>
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{label}</Text>
    </Pressable>
  );
}

function SectionTitle({ title, action }: { title: string; action: string }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionText}>{title}</Text>
      <Text style={styles.sectionAction}>{action}</Text>
    </View>
  );
}

function Badge({ label, tone }: { label: string; tone: "amber" | "blue" }) {
  return (
    <View style={[styles.badge, tone === "amber" ? styles.badgeAmber : styles.badgeBlue]}>
      <Text style={[styles.badgeText, tone === "amber" ? styles.badgeTextAmber : styles.badgeTextBlue]}>{label}</Text>
    </View>
  );
}

function StatusPill({ status }: { status: Order["status"] }) {
  const labelMap: Record<Order["status"], string> = {
    pending: "En attente",
    confirmed: "Confirmee",
    ready: "Prete",
    picked: "Retiree"
  };
  return <Badge label={labelMap[status]} tone={status === "ready" ? "blue" : "amber"} />;
}

function SettingRow({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <Pressable style={styles.settingRow}>
      <Ionicons name={icon} size={21} color={colors.tealDark} />
      <Text style={styles.settingLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}

function EmptyState({ icon, title, text }: { icon: keyof typeof Ionicons.glyphMap; title: string; text: string }) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name={icon} size={32} color={colors.tealDark} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.mutedCenter}>{text}</Text>
    </View>
  );
}

function stockLabel(stock: StockLevel) {
  const labels: Record<StockLevel, string> = {
    available: "Disponible",
    low: "Stock limite",
    unavailable: "Indisponible",
    prescription: "Avec validation"
  };
  return labels[stock];
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.slate
  },
  appShell: {
    flex: 1
  },
  content: {
    padding: 20,
    paddingBottom: 110
  },
  authScreen: {
    flex: 1,
    justifyContent: "center",
    padding: 22
  },
  brandMark: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 18
  },
  brandTitle: {
    fontSize: 31,
    fontWeight: "800",
    color: colors.ink,
    textAlign: "center"
  },
  brandSubtitle: {
    color: colors.muted,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 24
  },
  authCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow
  },
  segment: {
    flexDirection: "row",
    backgroundColor: colors.soft,
    borderRadius: 8,
    padding: 4,
    gap: 4,
    marginBottom: 14
  },
  segmentButton: {
    flex: 1,
    height: 42,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center"
  },
  segmentButtonActive: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line
  },
  segmentText: {
    color: colors.muted,
    fontWeight: "700"
  },
  segmentTextActive: {
    color: colors.tealDark
  },
  inputBox: {
    height: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
    backgroundColor: colors.white
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 15
  },
  primaryButton: {
    height: 52,
    borderRadius: 8,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 4
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 15
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18
  },
  hello: {
    color: colors.muted,
    fontSize: 14
  },
  headerTitle: {
    color: colors.ink,
    fontSize: 23,
    fontWeight: "800",
    marginTop: 3
  },
  cartButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center"
  },
  cartBadge: {
    position: "absolute",
    top: 7,
    right: 7,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.red,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "800"
  },
  hero: {
    backgroundColor: colors.ink,
    borderRadius: 8,
    padding: 18,
    minHeight: 172,
    justifyContent: "space-between",
    marginBottom: 14
  },
  heroCopy: {
    maxWidth: 290
  },
  heroTitle: {
    color: colors.white,
    fontSize: 25,
    fontWeight: "900",
    lineHeight: 31
  },
  heroText: {
    color: "#CFE9E4",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8
  },
  heroAction: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.teal,
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 42
  },
  heroActionText: {
    color: colors.white,
    fontWeight: "800"
  },
  locationPanel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginBottom: 18
  },
  locationIcon: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center"
  },
  flex: {
    flex: 1
  },
  panelTitle: {
    color: colors.ink,
    fontWeight: "800",
    fontSize: 15
  },
  muted: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19
  },
  mutedCenter: {
    color: colors.muted,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19
  },
  smallButton: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.soft,
    alignItems: "center",
    justifyContent: "center"
  },
  smallButtonText: {
    color: colors.tealDark,
    fontWeight: "800"
  },
  sectionTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 10
  },
  sectionText: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  sectionAction: {
    color: colors.tealDark,
    fontSize: 13,
    fontWeight: "800"
  },
  pharmacyCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10
  },
  pharmacyIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.soft,
    alignItems: "center",
    justifyContent: "center"
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 3
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8
  },
  metaText: {
    color: colors.tealDark,
    backgroundColor: colors.soft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: "700"
  },
  searchBox: {
    minHeight: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10
  },
  searchInput: {
    flex: 1,
    color: colors.ink,
    fontSize: 15
  },
  pharmacyRail: {
    gap: 10,
    paddingRight: 20
  },
  pharmacyPill: {
    width: 170,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    padding: 12
  },
  pharmacyPillActive: {
    borderColor: colors.teal,
    backgroundColor: colors.mint
  },
  pharmacyPillName: {
    color: colors.ink,
    fontWeight: "800",
    marginBottom: 6
  },
  pharmacyPillNameActive: {
    color: colors.tealDark
  },
  pharmacyPillMeta: {
    color: colors.muted,
    fontSize: 12
  },
  medicineCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginBottom: 12
  },
  medicineHeader: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    marginBottom: 8
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  badgeAmber: {
    backgroundColor: colors.amberSoft
  },
  badgeBlue: {
    backgroundColor: colors.blueSoft
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800"
  },
  badgeTextAmber: {
    color: colors.amber
  },
  badgeTextBlue: {
    color: colors.blue
  },
  unavailableText: {
    color: colors.red,
    backgroundColor: colors.redSoft,
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
    fontWeight: "700"
  },
  availabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.line
  },
  availabilityName: {
    color: colors.ink,
    fontWeight: "700",
    fontSize: 14
  },
  price: {
    color: colors.tealDark,
    fontWeight: "900",
    fontSize: 14
  },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center"
  },
  uploadBox: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18,
    alignItems: "center"
  },
  uploadIcon: {
    width: 68,
    height: 68,
    borderRadius: 8,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  uploadTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6,
    textAlign: "center"
  },
  prescriptionPharmacy: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginBottom: 12
  },
  cartRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden"
  },
  stepperButton: {
    width: 34,
    height: 34,
    backgroundColor: colors.soft,
    alignItems: "center",
    justifyContent: "center"
  },
  stepperText: {
    width: 32,
    textAlign: "center",
    color: colors.ink,
    fontWeight: "800"
  },
  paymentLabel: {
    color: colors.ink,
    fontWeight: "800",
    marginTop: 14,
    marginBottom: 8
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12
  },
  totalLabel: {
    color: colors.muted,
    fontWeight: "700"
  },
  totalValue: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "900"
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  pickupCode: {
    backgroundColor: colors.soft,
    borderRadius: 8,
    padding: 12,
    marginVertical: 12
  },
  pickupCodeLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  pickupCodeText: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 4
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    padding: 24,
    marginBottom: 12
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "900",
    marginTop: 10,
    marginBottom: 4
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 20,
    alignItems: "center"
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  avatarText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 28
  },
  profileName: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 4
  },
  settingsCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    marginTop: 14,
    overflow: "hidden"
  },
  settingRow: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line
  },
  settingLabel: {
    flex: 1,
    color: colors.ink,
    fontWeight: "700"
  },
  logoutButton: {
    marginTop: 14,
    height: 52,
    borderRadius: 8,
    backgroundColor: colors.redSoft,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8
  },
  logoutText: {
    color: colors.red,
    fontWeight: "900"
  },
  tabs: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    height: 72,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    ...shadow
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4
  },
  tabLabel: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: "800"
  },
  tabLabelActive: {
    color: colors.tealDark
  }
});
