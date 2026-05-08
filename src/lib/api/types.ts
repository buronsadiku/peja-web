export const SUPPORTED_LANGUAGES = [
  "en",
  "fr",
  "nl",
  "de",
  "es",
  "it",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export type EventStatus = "draft" | "active" | "paused" | "archived";

export type PlanTier = "essentials" | "premium" | "bundle";

export type TranscriptStatus =
  | "pending"
  | "processing"
  | "done"
  | "failed"
  | "skipped";

export type SubmissionSource = "kiosk" | "qr_scan" | "direct_link";

export type MessageFilter =
  | "all"
  | "favorites"
  | "with_photo"
  | "with_video"
  | "audio_only";

export type MessageSort = "newest" | "oldest" | "longest";

export type EmailPreferences = {
  marketing: boolean;
  digest: boolean;
  alerts: boolean;
};

export type User = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  preferredLanguage: SupportedLanguage | string;
  role: string;
  emailPreferences: EmailPreferences | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthResult = {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type Event = {
  id: string;
  ownerUserId: string;
  slug: string;
  partnerAName: string;
  partnerBName: string;
  weddingDate: string | null;
  venueName: string | null;
  venueCity: string | null;
  expectedGuests: number | null;
  welcomeMessage: string | null;
  themeColor: string;
  couplePhotoUrl: string | null;
  planTier: PlanTier | string | null;
  messageLimit: number | null;
  status: EventStatus | string;
  submissionsEnabled: boolean;
  defaultLanguage: SupportedLanguage | string;
  createdAt: string;
  updatedAt: string;
};

export type EventStats = {
  totalMessages: number;
  audioMessages: number;
  videoCount: number;
  photoCount: number;
  writtenMessages: number;
  favorites: number;
};

export type MessageSummary = {
  id: string;
  guestNames: string;
  hasAudio: boolean;
  hasVideo: boolean;
  hasPhoto: boolean;
  mediaCount: number;
  audioDurationSec: number | null;
  transcriptSnippet: string | null;
  writtenNote: string | null;
  isFavorite: boolean;
  isGoldBookSelected: boolean;
  createdAt: string;
  photoThumbUrl: string | null;
};

export type MessageMediaItem = GalleryItem;

export type MessageDetail = {
  id: string;
  guestNames: string;
  audioUrl: string | null;
  audioDurationSec: number | null;
  audioMimeType: string | null;
  media: GalleryItem[];
  writtenNote: string | null;
  transcript: string | null;
  transcriptLanguage: string | null;
  transcriptStatus: TranscriptStatus | string;
  isFavorite: boolean;
  isGoldBookSelected: boolean;
  coupleNotes: string | null;
  audioTrimStartSec: number | null;
  audioTrimEndSec: number | null;
  submissionSource: SubmissionSource | string;
  createdAt: string;
};

export type CreateEventInput = {
  partnerAName: string;
  partnerBName: string;
  weddingDate?: string;
  venueName?: string;
  venueCity?: string;
  expectedGuests?: number;
};

export type UpdateEventInput = Partial<CreateEventInput> & {
  welcomeMessage?: string;
  themeColor?: string;
  couplePhotoUrl?: string;
  defaultLanguage?: SupportedLanguage;
  slug?: string;
  kioskPin?: string;
  submissionsEnabled?: boolean;
};

export type ListEventsQuery = {
  status?: EventStatus;
  cursor?: string;
  limit?: number;
};

export type ListMessagesQuery = {
  filter?: MessageFilter;
  search?: string;
  sort?: MessageSort;
  cursor?: string;
  limit?: number;
  includeOwnerUploads?: boolean;
};

export type UpdateMessageInput = {
  isFavorite?: boolean;
  isGoldBookSelected?: boolean;
  coupleNotes?: string | null;
  audioTrimStartSec?: number | null;
  audioTrimEndSec?: number | null;
  audioDurationSec?: number | null;
};

export type UpdateProfileInput = {
  fullName?: string;
  avatarUrl?: string;
  preferredLanguage?: SupportedLanguage;
  emailPreferences?: EmailPreferences;
};

export type Paginated<T> = {
  data: T[];
  nextCursor: string | null;
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details: Record<string, unknown>;
  };
};

export type InvitationChannel =
  | "whatsapp"
  | "email"
  | "sms"
  | "link"
  | "qr_print"
  | "ig_story";

export type InvitationFunnel = {
  sent: number;
  opened: number;
  submitted: number;
};

export type InvitationStats = {
  byChannel: Partial<Record<InvitationChannel | string, InvitationFunnel>>;
  totals: InvitationFunnel;
};

export type PublicKioskSettings = {
  captureAudio: boolean;
  capturePhoto: boolean;
  captureVideo: boolean;
  maxDurationSeconds: number;
  returnAfterSeconds: number;
  welcomeShowPhoto: boolean;
  welcomeShowLanguagePicker: boolean;
  welcomeChime: boolean;
  fullscreenLock: boolean;
  guidedMode: boolean;
  exitPin: string | null;
};

export type PublicEvent = {
  partnerAName: string;
  partnerBName: string;
  weddingDate: string | null;
  welcomeMessage: string | null;
  themeColor: string;
  couplePhotoUrl: string | null;
  defaultLanguage: string;
  supportedLanguages: string[];
  submissionOpen: boolean;
  limitReached: boolean;
  kiosk: PublicKioskSettings;
};

export type AudioUploadTarget = {
  kind: "audio";
  key: string;
  url: string;
  headers?: Record<string, string>;
  maxSizeBytes: number;
  expiresAt: string;
};

export type MediaUploadTarget = {
  mediaId: string;
  type: "photo" | "video";
  key: string;
  url: string;
  headers?: Record<string, string>;
  maxSizeBytes: number;
  expiresAt: string;
};

export type UploadUrlsResult = {
  audioTargets: AudioUploadTarget[];
  mediaTargets: MediaUploadTarget[];
};

export type GalleryItem = {
  id: string;
  type: "photo" | "video";
  uploaderType: "guest" | "owner";
  uploaderName: string | null;
  messageId: string | null;
  url: string | null;
  thumbUrl: string | null;
  width: number | null;
  height: number | null;
  durationSec: number | null;
  isFavorite: boolean;
  isGoldBookSelected: boolean;
  createdAt: string;
};

export type GalleryFeed = {
  data: GalleryItem[];
  nextCursor: string | null;
};

export type CreateMessageResult = {
  message: {
    id: string;
    status: string;
  };
};

export type KeepsakeSku =
  | "gold_book"
  | "video_montage"
  | "digital_album"
  | "audio_vinyl"
  | "thank_you_cards"
  | "canvas_print"
  | string;

export type KeepsakeProduct = {
  sku: KeepsakeSku;
  name: string;
  description: string;
  priceCents: number;
  currency: string;
  imageUrl?: string | null;
  timelineDays?: string | null;
};

export type KeepsakeCatalog = {
  products: KeepsakeProduct[];
};

export type KeepsakeProductDetail = {
  id: string;
  sku: string;
  slug: string;
  productType: string;
  name: string;
  description: string | null;
  basePriceCents: number;
  currency: string;
  category: string;
  heroImageUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  leadTimeMinDays: number | null;
  leadTimeMaxDays: number | null;
};

export type KeepsakeProductVariant = {
  id: string;
  sku: string;
  name: string;
  priceCents: number | null;
  currency: string;
  attributes: Record<string, unknown>;
  isActive: boolean;
  sortOrder: number;
};

export type KeepsakeCustomizationSchema = {
  productType: string;
  schemaJson: Record<string, unknown>;
  version: number;
};

export type KeepsakeProductDetailResult = {
  product: KeepsakeProductDetail;
  variants: KeepsakeProductVariant[];
  customizationSchema: KeepsakeCustomizationSchema | null;
};

export type JobStatusValue =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | string;

export type Job = {
  id: string;
  status: JobStatusValue;
  progress: number | null;
  result: unknown;
  error: string | null;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "cancelled"
  | "in_production"
  | "shipped"
  | "delivered"
  | string;

export type Order = {
  id: string;
  eventId: string;
  userId: string;
  orderType: string;
  status: OrderStatus;
  currency: string;
  subtotalCents: number;
  totalCents: number;
  paymentProvider: string | null;
  createdAt: string;
};

export type OrderItem = {
  id: string;
  productSku: string;
  productName: string;
  quantity: number;
  unitPriceCents: number;
};

export type OrderTracking = {
  carrier: string | null;
  number: string | null;
  url: string | null;
};

export type OrderDetail = {
  id: string;
  orderType: string;
  status: OrderStatus;
  totalCents: number;
  items: OrderItem[];
  tracking: OrderTracking | null;
  createdAt: string;
};

export type QrCodeFormat = "png" | "svg";

export type QrCodeResult = {
  qrData: string;
  shortUrl: string;
  format: QrCodeFormat;
};

export type CheckoutOrderType = "plan" | "keepsake";

export type CheckoutPlanTier = "essentials" | "premium" | "bundle";

export type CheckoutItem = {
  productSku: string;
  productVariantId?: string;
  quantity: number;
  customization?: Record<string, unknown>;
};

export type CheckoutShippingAddress = {
  name: string;
  line1: string;
  city: string;
  country: string;
  postalCode: string;
};

export type CheckoutSessionInput = {
  eventId: string;
  orderType: CheckoutOrderType;
  planTier?: CheckoutPlanTier;
  items?: CheckoutItem[] | null;
  shippingAddress?: CheckoutShippingAddress;
  successUrl: string;
  cancelUrl: string;
};

export type CheckoutSessionResult = {
  orderId: string;
  checkoutUrl: string;
  providerSessionId: string;
};

export type Plan = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  priceCents: number;
  currency: string;
  messageLimit: number | null;
  storageDays: number | null;
  creditCents: number;
  sortOrder: number;
};

export type Subscription = {
  id: string;
  eventId: string;
  planId: string;
  planCode: string;
  planName: string;
  status: string;
  creditCentsRemaining: number;
  activatedAt: string;
  expiresAt: string | null;
};

export type CoverPhotoContentType =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/heic";

export type CoverUploadResult = {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  maxSizeBytes: number;
};

export const KIOSK_MAX_DURATION_OPTIONS = [15, 30, 60, 90, 120, 180] as const;
export type KioskMaxDurationSeconds =
  (typeof KIOSK_MAX_DURATION_OPTIONS)[number];

export const KIOSK_RETURN_AFTER_OPTIONS = [10, 20, 30, 60, 120] as const;
export type KioskReturnAfterSeconds =
  (typeof KIOSK_RETURN_AFTER_OPTIONS)[number];

export const KIOSK_OFFLINE_STORAGE_OPTIONS = [
  100, 250, 500, 1000, 2000, 5000,
] as const;
export type KioskOfflineStorageMb =
  (typeof KIOSK_OFFLINE_STORAGE_OPTIONS)[number];

export const KIOSK_WELCOME_NOTE_MAX = 180;

export type KioskSettings = {
  id: string;
  eventId: string;
  captureAudio: boolean;
  capturePhoto: boolean;
  captureVideo: boolean;
  maxDurationSeconds: number;
  returnAfterSeconds: number;
  fullscreenLock: boolean;
  guidedMode: boolean;
  exitPin: string | null;
  airplaneMode: boolean;
  welcomeNote: string | null;
  welcomeShowPhoto: boolean;
  welcomeShowLanguagePicker: boolean;
  welcomeChime: boolean;
  offlineStore: boolean;
  offlineStorageMb: number;
  offlineNotify: boolean;
  defaultLanguage: SupportedLanguage | string;
  supportedLanguages: (SupportedLanguage | string)[];
  createdAt: string;
  updatedAt: string;
};

export type UpdateKioskSettingsInput = Partial<
  Omit<KioskSettings, "id" | "eventId" | "createdAt" | "updatedAt">
>;
