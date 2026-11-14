export type QrFormMode = "native" | "external";

export type QrPageSettings = {
  id: string;
  form_mode: QrFormMode;
  external_form_url: string | null;
  whatsapp_number: string | null;
  updated_at: string;
};

export const QR_GIVEAWAY_STATIONS = [
  "Live Photo Booth",
  "Tote Bag Printing",
  "DTF T-Shirt Printing",
  "AI Station",
  "VR Gaming",
  "Fridge Magnets / Keychains",
  "Interactive Games",
] as const;

export type QrGiveawayStation = (typeof QR_GIVEAWAY_STATIONS)[number];

export const QR_SOFT_COPY_MESSAGE =
  "Hi Visriva! Here is a photo of my physical print from the event. Could you please send me the soft copy?";

export type QrGiveawayEntry = {
  id: string;
  created_at: string;
  full_name: string;
  instagram_handle: string;
  phone: string;
  station: string;
  screenshot_path: string | null;
  screenshot_url: string | null;
};