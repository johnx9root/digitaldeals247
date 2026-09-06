export type ProductCategory = "phone" | "car";

/** Public shop shows available + sold; archived is hidden. */
export type ProductStatus = "available" | "sold" | "archived";

export type Product = {
  id: string;
  category: ProductCategory;
  title: string;
  price: number;
  description: string;
  images: string[];
  /** Prefer `status`; kept in sync for older callers. */
  isAvailable: boolean;
  status: ProductStatus;
  soldAt: string | null;
  created_at: string;
};

export type PhoneSpecs = {
  id: string;
  product_id: string;
  brand: string;
  model: string;
  storage: string;
  color: string;
  battery_health: string;
  condition: string;
};

export type CarSpecs = {
  id: string;
  product_id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  color: string;
};

export type BuybackStatus =
  | "Pending"
  | "Viewed"
  | "Counter-offered"
  | "Bought"
  | "Rejected";

export type BuybackSubmission = {
  id: string;
  brand: string;
  model: string;
  damage_type: string;
  is_locked: boolean;
  photos: string[];
  whatsapp: string;
  estimated_price: string;
  /** Proposed/agreed admin commission on the resale deal (e.g. 20). */
  commission_percent: number;
  /** True once admin confirms the commission with the seller. */
  commission_agreed: boolean;
  status: BuybackStatus;
  created_at: string;
};

export type ProductWithSpecs = Product & {
  phone_specs?: PhoneSpecs | null;
  car_specs?: CarSpecs | null;
};

export const DAMAGE_TYPES = [
  "Broken Screen",
  "Water Damage",
  "Dead Motherboard",
  "Camera Issue",
  "Battery Issue",
  "Other",
] as const;

export const BUYBACK_STATUSES: BuybackStatus[] = [
  "Pending",
  "Viewed",
  "Counter-offered",
  "Bought",
  "Rejected",
];

export const PRODUCT_STATUSES: ProductStatus[] = [
  "available",
  "sold",
  "archived",
];

/** Typical DigitalDeals commission options for phone buyback/resale deals. */
export const COMMISSION_RATES = [15, 20, 25, 30, 35, 40] as const;

export const DEFAULT_COMMISSION_PERCENT = 20;

export const PHONE_MODELS: Record<"Samsung" | "Apple", string[]> = {
  Samsung: [
    "Galaxy S24 Ultra",
    "Galaxy S24",
    "Galaxy S23 Ultra",
    "Galaxy S23",
    "Galaxy S22",
    "Galaxy A54",
    "Galaxy A34",
    "Galaxy Note 20",
  ],
  Apple: [
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15",
    "iPhone 14 Pro Max",
    "iPhone 14 Pro",
    "iPhone 14",
    "iPhone 13 Pro",
    "iPhone 13",
    "iPhone 12",
    "iPhone 11",
  ],
};

export function statusFromFlags(
  status: unknown,
  isAvailable: unknown,
  soldAt?: unknown
): ProductStatus {
  if (status === "available" || status === "sold" || status === "archived") {
    return status;
  }
  if (soldAt) return "sold";
  return isAvailable ? "available" : "archived";
}

export function isPublicProduct(status: ProductStatus) {
  return status === "available" || status === "sold";
}
