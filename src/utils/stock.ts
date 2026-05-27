import { StockLevel } from "../types";

export function stockLabel(stock: StockLevel) {
  const labels: Record<StockLevel, string> = {
    available: "Disponible",
    low: "Stock limite",
    unavailable: "Indisponible",
    prescription: "Avec validation"
  };
  return labels[stock];
}
