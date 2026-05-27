import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, View } from "react-native";
import { AuthScreen } from "../features/auth/screens/AuthScreen";
import { HomeScreen } from "../features/home/screens/HomeScreen";
import { OrdersScreen } from "../features/orders/screens/OrdersScreen";
import { PrescriptionScreen } from "../features/prescriptions/screens/PrescriptionScreen";
import { ProfileScreen } from "../features/profile/screens/ProfileScreen";
import { SearchScreen } from "../features/search/screens/SearchScreen";
import { BottomTabs } from "../navigation/BottomTabs";
import { styles } from "../shared/styles";
import { AppHeader } from "./AppHeader";
import { usePharmaConnectApp } from "./usePharmaConnectApp";

export function AppShell() {
  const app = usePharmaConnectApp();

  if (!app.auth.isAuthed) {
    return (
      <>
        <StatusBar style="dark" />
        <AuthScreen
          authMode={app.auth.authMode}
          setAuthMode={app.auth.setAuthMode}
          onSubmit={app.auth.login}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.appShell}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <AppHeader
            cartCount={app.orders.cart.length}
            onCartPress={() => app.navigation.setActiveTab("orders")}
          />

          {app.navigation.activeTab === "home" && (
            <HomeScreen
              locationEnabled={app.location.locationEnabled}
              nearbyPharmacies={app.location.nearbyPharmacies}
              onEnableLocation={app.location.enableLocation}
              onOpenSearch={() => app.navigation.setActiveTab("search")}
              onSelectPharmacy={app.search.selectPharmacyForSearch}
            />
          )}

          {app.navigation.activeTab === "search" && (
            <SearchScreen
              query={app.search.query}
              setQuery={app.search.setQuery}
              pharmacyQuery={app.search.pharmacyQuery}
              setPharmacyQuery={app.search.setPharmacyQuery}
              filteredMedicines={app.search.filteredMedicines}
              filteredPharmacies={app.search.filteredPharmacies}
              selectedPharmacy={app.search.selectedPharmacy}
              setSelectedPharmacy={app.search.setSelectedPharmacy}
              onAdd={app.orders.addToCart}
            />
          )}

          {app.navigation.activeTab === "prescription" && (
            <PrescriptionScreen
              fileName={app.prescriptions.prescriptionFile}
              pharmacies={app.location.nearbyPharmacies}
              onPick={app.prescriptions.pickPrescription}
              onSelectPharmacy={app.prescriptions.requestPrescriptionQuote}
            />
          )}

          {app.navigation.activeTab === "orders" && (
            <OrdersScreen
              cart={app.orders.cart}
              orders={app.orders.orders}
              paymentMode={app.orders.paymentMode}
              total={app.orders.cartTotal}
              setPaymentMode={app.orders.setPaymentMode}
              onQuantity={app.orders.updateQuantity}
              onPlaceOrder={app.orders.placeOrder}
            />
          )}

          {app.navigation.activeTab === "profile" && <ProfileScreen onLogout={app.auth.logout} />}
        </ScrollView>

        <BottomTabs
          activeTab={app.navigation.activeTab}
          setActiveTab={app.navigation.setActiveTab}
        />
      </View>
    </SafeAreaView>
  );
}
