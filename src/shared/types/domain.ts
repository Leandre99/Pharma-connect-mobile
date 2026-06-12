export type PaymentMode = "online" | "pickup";

export type StockLevel = "available" | "low" | "unavailable" | "prescription";

export type PharmacyVerificationStatus = "seeded" | "claimed" | "verified";

export type PharmacyService =
  | "night-duty"
  | "delivery"
  | "online-payment"
  | "prescription-upload"
  | "vaccination";

export type Medicine = {
  id: string;
  name: string;
  molecule: string;
  form: string;
  prescriptionRequired: boolean;
  category: string;
};

export type InventoryItem = {
  medicineId: string;
  price: number;
  stock: StockLevel;
  quantity: number;
};

export type Pharmacy = {
  id: string;
  name: string;
  area: string;
  address: string;
  phone: string;
  distanceKm: number;
  rating: number;
  openUntil: string;
  isOpenNow: boolean;
  isOnDuty: boolean;
  latitude: number;
  longitude: number;
  acceptsOnlinePayment: boolean;
  services: PharmacyService[];
  verificationStatus: PharmacyVerificationStatus;
  lastUpdatedAt: string;
  inventory: InventoryItem[];
};

export type CartItem = {
  medicine: Medicine;
  pharmacy: Pharmacy;
  price: number;
  quantity: number;
};

export type OrderStatus = "pending" | "confirmed" | "ready" | "picked";

export type Order = {
  id: string;
  pharmacyName: string;
  status: OrderStatus;
  total: number;
  paymentMode: PaymentMode;
  pickupCode: string;
};
