export const SITE = {
  name: "DigitalDeals24/7",
  tagline: "Quality pre-owned phones & cars in Windhoek",
  email: "loxionyasheinvestment@gmail.com",
  location: "Windhoek, Namibia",
  whatsapp: {
    display: "+264 81 669 6885",
    e164: "264816696885",
  },
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/sell", label: "Sell Your Phone" },
  { href: "/prices", label: "Price Guide" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${SITE.whatsapp.e164}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
