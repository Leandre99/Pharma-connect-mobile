import { Medicine, Order, PaymentMode, Pharmacy } from "../shared/types";

const DEFAULT_API_URL = "http://localhost:4000";

const apiUrl = (process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, "");

type ApiResponse<T> = {
  data: T;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.error ?? "Une erreur est survenue avec le backend.";
    throw new Error(message);
  }

  return (payload as ApiResponse<T>).data;
}

export type CreateOrderPayload = {
  paymentMode: PaymentMode;
  items: {
    medicineId: string;
    pharmacyId: string;
    quantity: number;
  }[];
};

export const apiClient = {
  login(phone: string, password: string) {
    return request<{ token: string; user: { id: string; email: string; name: string } }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email: phone, password })
      }
    );
  },

  listMedicines(query?: string) {
    const params = query ? `?query=${encodeURIComponent(query)}` : "";
    return request<Medicine[]>(`/api/medicines${params}`);
  },

  listPharmacies(query?: string) {
    const params = query ? `?query=${encodeURIComponent(query)}` : "";
    return request<Pharmacy[]>(`/api/pharmacies${params}`);
  },

  listOrders() {
    return request<Order[]>("/api/orders");
  },

  createOrder(payload: CreateOrderPayload) {
    return request<Order>("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  requestPrescriptionQuote(payload: {
    pharmacyId: string;
    fileName?: string | null;
    note?: string;
  }) {
    return request<{ id: string; status: string }>("/api/prescriptions/quote", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }
};
