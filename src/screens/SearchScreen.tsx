import { Pressable, ScrollView, Text, View } from "react-native";
import { Medicine, Pharmacy } from "../types";
import { styles } from "../styles/appStyles";
import { MedicineCard } from "../components/cards";
import { SearchInput, SectionTitle } from "../components/common";

export function SearchScreen({
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
