import { StyleSheet } from "react-native";
import { colors, shadow } from "../theme";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.slate
  },
  appShell: {
    flex: 1
  },
  content: {
    padding: 20,
    paddingBottom: 110
  },
  authScreen: {
    flex: 1,
    justifyContent: "center",
    padding: 22
  },
  brandMark: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 18
  },
  brandTitle: {
    fontSize: 31,
    fontWeight: "800",
    color: colors.ink,
    textAlign: "center"
  },
  brandSubtitle: {
    color: colors.muted,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 24
  },
  authCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow
  },
  segment: {
    flexDirection: "row",
    backgroundColor: colors.soft,
    borderRadius: 8,
    padding: 4,
    gap: 4,
    marginBottom: 14
  },
  segmentButton: {
    flex: 1,
    height: 42,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center"
  },
  segmentButtonActive: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line
  },
  segmentText: {
    color: colors.muted,
    fontWeight: "700"
  },
  segmentTextActive: {
    color: colors.tealDark
  },
  inputBox: {
    height: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
    backgroundColor: colors.white
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 15
  },
  primaryButton: {
    height: 52,
    borderRadius: 8,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 4
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 15
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18
  },
  hello: {
    color: colors.muted,
    fontSize: 14
  },
  headerTitle: {
    color: colors.ink,
    fontSize: 23,
    fontWeight: "800",
    marginTop: 3
  },
  cartButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center"
  },
  cartBadge: {
    position: "absolute",
    top: 7,
    right: 7,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.red,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "800"
  },
  hero: {
    backgroundColor: colors.ink,
    borderRadius: 8,
    padding: 18,
    minHeight: 172,
    justifyContent: "space-between",
    marginBottom: 14
  },
  heroCopy: {
    maxWidth: 290
  },
  heroTitle: {
    color: colors.white,
    fontSize: 25,
    fontWeight: "900",
    lineHeight: 31
  },
  heroText: {
    color: "#CFE9E4",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8
  },
  heroAction: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.teal,
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 42
  },
  heroActionText: {
    color: colors.white,
    fontWeight: "800"
  },
  locationPanel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginBottom: 18
  },
  locationIcon: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center"
  },
  flex: {
    flex: 1
  },
  panelTitle: {
    color: colors.ink,
    fontWeight: "800",
    fontSize: 15
  },
  muted: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19
  },
  mutedCenter: {
    color: colors.muted,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19
  },
  smallButton: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.soft,
    alignItems: "center",
    justifyContent: "center"
  },
  smallButtonText: {
    color: colors.tealDark,
    fontWeight: "800"
  },
  sectionTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 10
  },
  sectionText: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  sectionAction: {
    color: colors.tealDark,
    fontSize: 13,
    fontWeight: "800"
  },
  pharmacyCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10
  },
  pharmacyIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.soft,
    alignItems: "center",
    justifyContent: "center"
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 3
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8
  },
  metaText: {
    color: colors.tealDark,
    backgroundColor: colors.soft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: "700"
  },
  searchBox: {
    minHeight: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10
  },
  searchInput: {
    flex: 1,
    color: colors.ink,
    fontSize: 15
  },
  pharmacyRail: {
    gap: 10,
    paddingRight: 20
  },
  pharmacyPill: {
    width: 170,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    padding: 12
  },
  pharmacyPillActive: {
    borderColor: colors.teal,
    backgroundColor: colors.mint
  },
  pharmacyPillName: {
    color: colors.ink,
    fontWeight: "800",
    marginBottom: 6
  },
  pharmacyPillNameActive: {
    color: colors.tealDark
  },
  pharmacyPillMeta: {
    color: colors.muted,
    fontSize: 12
  },
  medicineCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginBottom: 12
  },
  medicineHeader: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    marginBottom: 8
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  badgeAmber: {
    backgroundColor: colors.amberSoft
  },
  badgeBlue: {
    backgroundColor: colors.blueSoft
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800"
  },
  badgeTextAmber: {
    color: colors.amber
  },
  badgeTextBlue: {
    color: colors.blue
  },
  unavailableText: {
    color: colors.red,
    backgroundColor: colors.redSoft,
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
    fontWeight: "700"
  },
  availabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.line
  },
  availabilityName: {
    color: colors.ink,
    fontWeight: "700",
    fontSize: 14
  },
  price: {
    color: colors.tealDark,
    fontWeight: "900",
    fontSize: 14
  },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center"
  },
  uploadBox: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18,
    alignItems: "center"
  },
  uploadIcon: {
    width: 68,
    height: 68,
    borderRadius: 8,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  uploadTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6,
    textAlign: "center"
  },
  prescriptionPharmacy: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginBottom: 12
  },
  cartRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden"
  },
  stepperButton: {
    width: 34,
    height: 34,
    backgroundColor: colors.soft,
    alignItems: "center",
    justifyContent: "center"
  },
  stepperText: {
    width: 32,
    textAlign: "center",
    color: colors.ink,
    fontWeight: "800"
  },
  paymentLabel: {
    color: colors.ink,
    fontWeight: "800",
    marginTop: 14,
    marginBottom: 8
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12
  },
  totalLabel: {
    color: colors.muted,
    fontWeight: "700"
  },
  totalValue: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "900"
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  pickupCode: {
    backgroundColor: colors.soft,
    borderRadius: 8,
    padding: 12,
    marginVertical: 12
  },
  pickupCodeLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  pickupCodeText: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 4
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    padding: 24,
    marginBottom: 12
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "900",
    marginTop: 10,
    marginBottom: 4
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 20,
    alignItems: "center"
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  avatarText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 28
  },
  profileName: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 4
  },
  settingsCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    marginTop: 14,
    overflow: "hidden"
  },
  settingRow: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line
  },
  settingLabel: {
    flex: 1,
    color: colors.ink,
    fontWeight: "700"
  },
  logoutButton: {
    marginTop: 14,
    height: 52,
    borderRadius: 8,
    backgroundColor: colors.redSoft,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8
  },
  logoutText: {
    color: colors.red,
    fontWeight: "900"
  },
  tabs: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    height: 72,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    ...shadow
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4
  },
  tabLabel: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: "800"
  },
  tabLabelActive: {
    color: colors.tealDark
  }
});

