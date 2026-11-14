export type AdminNavItem = {
  href: string;
  label: string;
  ready: boolean;
  icon:
    | "dashboard"
    | "leads"
    | "website"
    | "services"
    | "pricing"
    | "inventory"
    | "bookings"
    | "customers"
    | "qr"
    | "eventImages"
    | "googleReviews";
};

export const adminNav: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", ready: true, icon: "dashboard" },
  { href: "/admin/leads", label: "Enquiries & leads", ready: true, icon: "leads" },
  { href: "/admin/website", label: "Website CMS", ready: true, icon: "website" },
  { href: "/admin/services", label: "Services & categories", ready: true, icon: "services" },
  { href: "/admin/pricing", label: "Pricing & packages", ready: true, icon: "pricing" },
  { href: "/admin/inventory", label: "Inventory & stations", ready: true, icon: "inventory" },
  { href: "/admin/bookings", label: "Bookings", ready: true, icon: "bookings" },
  { href: "/admin/customers", label: "Customers", ready: true, icon: "customers" },
  { href: "/admin/qr", label: "QR giveaway (/qr)", ready: true, icon: "qr" },
  { href: "/admin/event-images", label: "Event images", ready: true, icon: "eventImages" },
  { href: "/admin/google-reviews", label: "Google reviews", ready: true, icon: "googleReviews" },
];