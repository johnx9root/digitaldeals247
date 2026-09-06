import type { BuybackSubmission, ProductWithSpecs } from "@/lib/types";

const INITIAL_PRODUCTS: ProductWithSpecs[] = [
  {
    id: "11111111-1111-4111-8111-111111111101",
    category: "phone",
    title: "iPhone 13 Pro 256GB",
    price: 8500,
    description:
      "Quality-checked iPhone 13 Pro in Sierra Blue. Minor frame wear, battery healthy, Face ID working.",
    images: [
      "https://images.unsplash.com/photo-1632661674592-907eda1c8d4c?w=800&q=80",
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80",
    ],
    isAvailable: true,
    status: "available",
    soldAt: null,
    created_at: "2026-08-01T10:00:00.000Z",
    phone_specs: {
      id: "ps1",
      product_id: "11111111-1111-4111-8111-111111111101",
      brand: "Apple",
      model: "iPhone 13 Pro",
      storage: "256GB",
      color: "Sierra Blue",
      battery_health: "89%",
      condition: "Good",
    },
  },
  {
    id: "11111111-1111-4111-8111-111111111102",
    category: "phone",
    title: "Samsung Galaxy S23 128GB",
    price: 7200,
    description:
      "Clean Galaxy S23 with original box. Screen protector applied, no cracks.",
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80",
    ],
    isAvailable: true,
    status: "available",
    soldAt: null,
    created_at: "2026-08-05T10:00:00.000Z",
    phone_specs: {
      id: "ps2",
      product_id: "11111111-1111-4111-8111-111111111102",
      brand: "Samsung",
      model: "Galaxy S23",
      storage: "128GB",
      color: "Phantom Black",
      battery_health: "92%",
      condition: "Excellent",
    },
  },
  {
    id: "11111111-1111-4111-8111-111111111103",
    category: "phone",
    title: "iPhone 12 64GB",
    price: 4200,
    description: "Affordable daily driver. Battery replaced recently.",
    images: [
      "https://images.unsplash.com/photo-1603898037225-1c70d8c2f4c2?w=800&q=80",
    ],
    isAvailable: false,
    status: "sold",
    soldAt: "2026-08-28T14:00:00.000Z",
    created_at: "2026-08-12T10:00:00.000Z",
    phone_specs: {
      id: "ps3",
      product_id: "11111111-1111-4111-8111-111111111103",
      brand: "Apple",
      model: "iPhone 12",
      storage: "64GB",
      color: "Black",
      battery_health: "95%",
      condition: "Fair",
    },
  },
  {
    id: "22222222-2222-4222-8222-222222222201",
    category: "car",
    title: "Toyota Corolla 2018",
    price: 185000,
    description:
      "Reliable automatic Corolla. Service history available. Ideal Windhoek city car.",
    images: [
      "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800&q=80",
    ],
    isAvailable: true,
    status: "available",
    soldAt: null,
    created_at: "2026-07-20T10:00:00.000Z",
    car_specs: {
      id: "cs1",
      product_id: "22222222-2222-4222-8222-222222222201",
      make: "Toyota",
      model: "Corolla",
      year: 2018,
      mileage: 98000,
      fuel_type: "Petrol",
      transmission: "Automatic",
      color: "Silver",
    },
  },
  {
    id: "22222222-2222-4222-8222-222222222202",
    category: "car",
    title: "Volkswagen Polo Vivo 2020",
    price: 165000,
    description: "Low mileage Polo Vivo. Clean interior, recently serviced.",
    images: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
    ],
    isAvailable: true,
    status: "available",
    soldAt: null,
    created_at: "2026-07-28T10:00:00.000Z",
    car_specs: {
      id: "cs2",
      product_id: "22222222-2222-4222-8222-222222222202",
      make: "Volkswagen",
      model: "Polo Vivo",
      year: 2020,
      mileage: 54000,
      fuel_type: "Petrol",
      transmission: "Manual",
      color: "White",
    },
  },
  {
    id: "22222222-2222-4222-8222-222222222203",
    category: "car",
    title: "BMW X3 2016",
    price: 295000,
    description: "Premium SUV feel. Full leather, reverse camera.",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    ],
    isAvailable: true,
    status: "available",
    soldAt: null,
    created_at: "2026-08-15T10:00:00.000Z",
    car_specs: {
      id: "cs3",
      product_id: "22222222-2222-4222-8222-222222222203",
      make: "BMW",
      model: "X3",
      year: 2016,
      mileage: 121000,
      fuel_type: "Diesel",
      transmission: "Automatic",
      color: "Black",
    },
  },
];

export const mockStore: {
  products: ProductWithSpecs[];
  buybacks: BuybackSubmission[];
} = {
  products: structuredClone(INITIAL_PRODUCTS),
  buybacks: [
    {
      id: "bb-demo-1",
      brand: "Apple",
      model: "iPhone 13",
      damage_type: "Broken Screen",
      is_locked: false,
      photos: [],
      whatsapp: "+264811234567",
      estimated_price: "N$1,500 - N$2,500",
      commission_percent: 20,
      commission_agreed: false,
      status: "Pending",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  ],
};

export function formatNAD(amount: number) {
  return `N$${amount.toLocaleString("en-NA")}`;
}
