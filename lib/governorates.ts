// lib/governorates.ts

// Flat COD shipping fee used whenever a governorate has no saved rate yet.
// Kept here (not in convex/shipping.ts) so both frontend and backend code
// can import it without pulling Convex server functions into the browser
// bundle.
export const DEFAULT_SHIPPING_FEE = 45;

export const EGYPT_GOVERNORATES = [
  "Cairo", "Alexandria", "Giza", "Qalyubia", "Port Said", "Suez", "Dakahlia",
  "Sharqia", "Gharbia", "Monufia", "Beheira", "Kafr El Sheikh", "Damietta",
  "Ismailia", "Fayoum", "Beni Suef", "Minya", "Assiut", "Sohag", "Qena",
  "Luxor", "Aswan", "Red Sea", "New Valley", "Matrouh", "North Sinai", "South Sinai",
] as const;
