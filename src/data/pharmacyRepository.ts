import { seedMedicines, seedOrders, seedPharmacies } from "./pharmacySeed";

const byDistance = (a: { distanceKm: number }, b: { distanceKm: number }) =>
  a.distanceKm - b.distanceKm;

const normalize = (value: string) => value.trim().toLowerCase();

export const pharmacyRepository = {
  listMedicines() {
    return seedMedicines;
  },

  listPharmacies() {
    return [...seedPharmacies].sort(byDistance);
  },

  listOrders() {
    return seedOrders;
  },

  searchMedicines(query: string) {
    const normalized = normalize(query);
    if (!normalized) return seedMedicines;

    return seedMedicines.filter((medicine) =>
      [medicine.name, medicine.molecule, medicine.category].some((value) =>
        normalize(value).includes(normalized)
      )
    );
  },

  searchPharmacies(query: string) {
    const pharmacies = this.listPharmacies();
    const normalized = normalize(query);
    if (!normalized) return pharmacies;

    return pharmacies.filter((pharmacy) =>
      [pharmacy.name, pharmacy.area, pharmacy.address, pharmacy.phone].some((value) =>
        normalize(value).includes(normalized)
      )
    );
  }
};
