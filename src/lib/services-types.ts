export type ServiceCategory = "photo-booths" | "ai-merchandise" | "games";

export type PublishStatus = "draft" | "preview" | "published" | "archived";

export type ServiceSpecs = {
  sizes?: string[];
  colors?: string[];
};

export type Service = {
  id: string;
  name: string;
  category: ServiceCategory;
  priceLabel: string;
  fromPrice: number | null;
  unitPrice?: number;
  unitLabel?: string;
  summary: string;
  includes: string[];
  footprint: string;
  guestMoment: string;
  image: string;
  comingSoon?: boolean;
  bookable?: boolean;
  description?: string;
  durationMinutes?: number;
  specs?: ServiceSpecs;
  publishStatus?: PublishStatus;
};
