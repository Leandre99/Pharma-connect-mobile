import { Order } from "../../types";
import { Badge } from "./Badge";

export function StatusPill({ status }: { status: Order["status"] }) {
  const labelMap: Record<Order["status"], string> = {
    pending: "En attente",
    confirmed: "Confirmee",
    ready: "Prete",
    picked: "Retiree"
  };

  return <Badge label={labelMap[status]} tone={status === "ready" ? "blue" : "amber"} />;
}
