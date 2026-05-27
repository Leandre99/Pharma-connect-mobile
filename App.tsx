import * as DocumentPicker from "expo-document-picker";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { Alert, SafeAreaView, ScrollView, View } from "react-native";
import { BottomTabs, Header } from "./src/components/layout";
import { medicines, pharmacies, sampleOrders } from "./src/data/mock";
import { styles } from "./src/styles/appStyles";
import { AuthScreen } from "./src/screens/AuthScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { OrdersScreen } from "./src/screens/OrdersScreen";
import { PrescriptionScreen } from "./src/screens/PrescriptionScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { SearchScreen } from "./src/screens/SearchScreen";
import { AuthMode, CartItem, Medicine, Order, PaymentMode, Pharmacy, Tab } from "./src/types";

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
      id: "CMD-" + Math.floor(1000 + Math.random() * 9000),
      pharmacyName: pharmacyNames,
      status: "pending",
      total: cartTotal,
      paymentMode,
      pickupCode: "PC-" + Math.floor(1000 + Math.random() * 9000)
    };

    setOrders((current) => [newOrder, ...current]);
    setCart([]);
    setActiveTab("orders");
  }

  if (!isAuthed) {
    return (
      <>
        <StatusBar style="dark" />
        <AuthScreen authMode={authMode} setAuthMode={setAuthMode} onSubmit={() => setIsAuthed(true)} />
      </>
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
                Alert.alert("Demande envoyee", pharmacy.name + " recevra votre ordonnance pour verifier prix et disponibilite.");
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
