export type StudioPageKey = "home" | "services" | "qr" | "reviews";

export type StudioBreakpoint = "desktop" | "mobile";

export type StudioViewport = StudioBreakpoint | "tablet";

export type StudioStylePatch = {
  fontFamily?: string;
  fontWeight?: string;
  fontSize?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: string;
  color?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  background?: string;
  backdropBlur?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  boxShadow?: string;
  width?: string;
  height?: string;
  objectFit?: string;
  objectPosition?: string;
  transform?: string;
  display?: string;
};

export type StudioImagePatch = {
  url?: string;
  alt?: string;
  naturalWidth?: number;
  naturalHeight?: number;
  objectFit?: string;
  zoom?: number;
  focalX?: number;
  focalY?: number;
};

export type StudioNodeOverride = {
  studioId: string;
  tag: string;
  label?: string;
  hidden?: boolean;
  deleted?: boolean;
  text?: string;
  href?: string;
  targetBlank?: boolean;
  buttonStyle?: "swipe" | "wave" | "liquid" | "gold";
  styles?: Partial<Record<StudioBreakpoint, StudioStylePatch>>;
  image?: StudioImagePatch;
};

export type StudioSnapshot = {
  id: string;
  label: string;
  createdAt: string;
  state: StudioPageState;
};

export type StudioPageState = {
  overrides: Record<string, StudioNodeOverride>;
  sectionOrder: string[];
  trash: StudioNodeOverride[];
  insertedBlocks: StudioInsertedBlock[];
  snapshots: StudioSnapshot[];
};

export type StudioInsertedBlock = {
  id: string;
  kind: StudioBlockKind;
  html?: string;
  anchorStudioId?: string;
  position?: "before" | "after" | "append";
};

export type StudioBlockKind =
  | "heading"
  | "paragraph"
  | "gold-button"
  | "image-card"
  | "flip-card"
  | "category-bar"
  | "pricing-card"
  | "faq"
  | "whatsapp-cta"
  | "review-card"
  | "html-embed";

export const EMPTY_STUDIO_PAGE_STATE: StudioPageState = {
  overrides: {},
  sectionOrder: [],
  trash: [],
  insertedBlocks: [],
  snapshots: [],
};

export const STUDIO_PAGES: { key: StudioPageKey; label: string; href: string; path: string }[] = [
  { key: "home", label: "Home", href: "/?studio=true", path: "/" },
  { key: "services", label: "Services", href: "/photo-booths?studio=true", path: "/photo-booths" },
  { key: "qr", label: "QR & Event Photos", href: "/qr?studio=true", path: "/qr" },
  { key: "reviews", label: "Google Reviews", href: "/reviews?studio=true", path: "/reviews" },
];

export const VISRIVA_BRAND_SWATCHES = ["#041A13", "#07261C", "#DCE8DF", "#C9A227", "#E5C158", "#FFFFFF"] as const;

export const STUDIO_STORAGE_EDITOR = "visriva-studio-mode";
export const STUDIO_STORAGE_DRAFT = "visriva-studio-draft";

export type StudioLayerNode = {
  studioId: string;
  tag: string;
  label: string;
  depth: number;
  children: StudioLayerNode[];
  rect?: { width: number; height: number };
};