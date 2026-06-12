import { Medicine, Order, Pharmacy } from "../shared/types";

export const seedMedicines: Medicine[] = [
  {
    id: "med-1",
    name: "Paracetamol 500 mg",
    molecule: "Paracetamol",
    form: "Comprime",
    prescriptionRequired: false,
    category: "Douleur et fievre"
  },
  {
    id: "med-2",
    name: "Amoxicilline 500 mg",
    molecule: "Amoxicilline",
    form: "Gelule",
    prescriptionRequired: true,
    category: "Antibiotique"
  },
  {
    id: "med-3",
    name: "Ibuprofene 400 mg",
    molecule: "Ibuprofene",
    form: "Comprime",
    prescriptionRequired: false,
    category: "Anti-inflammatoire"
  },
  {
    id: "med-4",
    name: "Cetirizine 10 mg",
    molecule: "Cetirizine",
    form: "Comprime",
    prescriptionRequired: false,
    category: "Allergie"
  },
  {
    id: "med-5",
    name: "Salbutamol inhalateur",
    molecule: "Salbutamol",
    form: "Inhalateur",
    prescriptionRequired: true,
    category: "Respiration"
  }
];

export const seedPharmacies: Pharmacy[] = [
  {
    id: "pha-1",
    name: "Pharmacie Saint Michel",
    area: "Cotonou",
    address: "Avenue Steinmetz, Cotonou",
    phone: "+229 01 97 00 00 01",
    distanceKm: 0.8,
    rating: 4.8,
    openUntil: "22:00",
    isOpenNow: true,
    isOnDuty: true,
    latitude: 6.372,
    longitude: 2.427,
    acceptsOnlinePayment: true,
    services: ["night-duty", "online-payment", "prescription-upload"],
    verificationStatus: "verified",
    lastUpdatedAt: "2026-06-01T09:30:00.000Z",
    inventory: [
      { medicineId: "med-1", price: 650, stock: "available", quantity: 24 },
      { medicineId: "med-2", price: 2300, stock: "prescription", quantity: 8 },
      { medicineId: "med-4", price: 1200, stock: "low", quantity: 3 }
    ]
  },
  {
    id: "pha-2",
    name: "Pharmacie de l'Etoile",
    area: "Akpakpa",
    address: "Carrefour Le Belier, Akpakpa",
    phone: "+229 01 97 00 00 02",
    distanceKm: 2.4,
    rating: 4.6,
    openUntil: "20:30",
    isOpenNow: true,
    isOnDuty: false,
    latitude: 6.365,
    longitude: 2.46,
    acceptsOnlinePayment: false,
    services: ["prescription-upload"],
    verificationStatus: "claimed",
    lastUpdatedAt: "2026-05-28T15:00:00.000Z",
    inventory: [
      { medicineId: "med-1", price: 700, stock: "available", quantity: 30 },
      { medicineId: "med-3", price: 900, stock: "available", quantity: 12 },
      { medicineId: "med-5", price: 5400, stock: "prescription", quantity: 5 }
    ]
  },
  {
    id: "pha-3",
    name: "Grande Pharmacie Porto-Novo",
    area: "Porto-Novo",
    address: "Quartier Ouando, Porto-Novo",
    phone: "+229 01 97 00 00 03",
    distanceKm: 28.6,
    rating: 4.7,
    openUntil: "23:00",
    isOpenNow: true,
    isOnDuty: true,
    latitude: 6.49,
    longitude: 2.628,
    acceptsOnlinePayment: true,
    services: ["night-duty", "delivery", "online-payment", "prescription-upload"],
    verificationStatus: "verified",
    lastUpdatedAt: "2026-06-02T11:45:00.000Z",
    inventory: [
      { medicineId: "med-2", price: 2150, stock: "prescription", quantity: 10 },
      { medicineId: "med-3", price: 850, stock: "low", quantity: 2 },
      { medicineId: "med-4", price: 1100, stock: "available", quantity: 18 },
      { medicineId: "med-5", price: 5200, stock: "prescription", quantity: 4 }
    ]
  }
];

export const seedOrders: Order[] = [
  {
    id: "CMD-2408",
    pharmacyName: "Pharmacie Saint Michel",
    status: "ready",
    total: 2950,
    paymentMode: "pickup",
    pickupCode: "PC-4821"
  }
];
