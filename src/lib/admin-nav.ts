export type AdminNavItem = {
  href: string;
  label: string;
  ready: boolean;
};

export const adminNav: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", ready: true },
  { href: "/admin/leads", label: "Enquiries & leads", ready: true },
  { href: "/admin/services", label: "Services", ready: true },
  { href: "/admin/categories", label: "Categories", ready: false },
  { href: "/admin/pricing", label: "Pricing", ready: false },
  { href: "/admin/inventory", label: "Inventory", ready: false },
  { href: "/admin/bookings", label: "Bookings", ready: false },
  { href: "/admin/customers", label: "Customers", ready: false },
  { href: "/admin/website", label: "Website CMS", ready: true },
];
