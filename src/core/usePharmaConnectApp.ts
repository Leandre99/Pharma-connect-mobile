import * as DocumentPicker from "expo-document-picker";
import * as Location from "expo-location";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { apiClient, pharmacyRepository } from "../data";
import {
  AuthMode,
  CartItem,
  Medicine,
  Order,
  PaymentMode,
  Pharmacy,
  Tab
} from "../shared/types";

export function usePharmaConnectApp() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [query, setQuery] = useState("");
  const [pharmacyQuery, setPharmacyQuery] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>(() => pharmacyRepository.listMedicines());
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(() => pharmacyRepository.listPharmacies());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => pharmacyRepository.listOrders());
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("pickup");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [nextMedicines, nextPharmacies, nextOrders] = await Promise.all([
          apiClient.listMedicines(),
          apiClient.listPharmacies(),
          apiClient.listOrders()
        ]);

        if (!isMounted) return;
        setMedicines(nextMedicines);
        setPharmacies(nextPharmacies);
        setOrders(nextOrders);
      } catch {
        if (!isMounted) return;
        setMedicines(pharmacyRepository.listMedicines());
        setPharmacies(pharmacyRepository.listPharmacies());
        setOrders(pharmacyRepository.listOrders());
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const nearbyPharmacies = pharmacies;

  const filteredMedicines = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return medicines;

    return medicines.filter((medicine) =>
      [medicine.name, medicine.molecule, medicine.category].some((value) =>
        value.toLowerCase().includes(normalized)
      )
    );
  }, [medicines, query]);

  const filteredPharmacies = useMemo(() => {
    const normalized = pharmacyQuery.trim().toLowerCase();
    const sortedPharmacies = [...pharmacies].sort((a, b) => a.distanceKm - b.distanceKm);
    if (!normalized) return sortedPharmacies;

    return sortedPharmacies.filter((pharmacy) =>
      [pharmacy.name, pharmacy.area, pharmacy.address, pharmacy.phone].some((value) =>
        value.toLowerCase().includes(normalized)
      )
    );
  }, [pharmacies, pharmacyQuery]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function enableLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Position non activee",
        "Vous pouvez toujours rechercher une pharmacie par nom ou quartier."
      );
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

  async function placeOrder() {
    if (cart.length === 0) {
      Alert.alert("Panier vide", "Ajoutez au moins un produit avant de valider.");
      return;
    }

    try {
      const newOrder = await apiClient.createOrder({
        paymentMode,
        items: cart.map((item) => ({
          medicineId: item.medicine.id,
          pharmacyId: item.pharmacy.id,
          quantity: item.quantity
        }))
      });

      setOrders((current) => [newOrder, ...current]);
      setCart([]);
      setActiveTab("orders");
    } catch {
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
  }

  function selectPharmacyForSearch(pharmacy: Pharmacy) {
    setSelectedPharmacy(pharmacy);
    setActiveTab("search");
  }

  async function requestPrescriptionQuote(pharmacy: Pharmacy) {
    setSelectedPharmacy(pharmacy);
    await apiClient
      .requestPrescriptionQuote({
        pharmacyId: pharmacy.id,
        fileName: prescriptionFile
      })
      .catch(() => null);

    Alert.alert(
      "Demande envoyee",
      pharmacy.name + " recevra votre ordonnance pour verifier prix et disponibilite."
    );
  }

  function logout() {
    setIsAuthed(false);
    setActiveTab("home");
  }

  return {
    auth: {
      isAuthed,
      authMode,
      setAuthMode,
      login: async () => {
        await apiClient.login("client@pharmaconnect.local", "password").catch(() => null);
        setIsAuthed(true);
      },
      logout
    },
    navigation: {
      activeTab,
      setActiveTab
    },
    search: {
      query,
      setQuery,
      pharmacyQuery,
      setPharmacyQuery,
      filteredMedicines,
      filteredPharmacies,
      selectedPharmacy,
      setSelectedPharmacy,
      selectPharmacyForSearch
    },
    location: {
      locationEnabled,
      enableLocation,
      nearbyPharmacies
    },
    prescriptions: {
      prescriptionFile,
      pickPrescription,
      requestPrescriptionQuote
    },
    orders: {
      cart,
      orders,
      paymentMode,
      setPaymentMode,
      cartTotal,
      addToCart,
      updateQuantity,
      placeOrder
    }
  };
}
