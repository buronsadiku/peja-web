export type ActivityListItem = {
  occurrenceId: string;
  templateId: string;
  slug: string;
  name: string;
  description: string | null;
  category: ActivityCategory;
  coverImageUrl: string | null;
  festivalDayId: string;
  date: string;
  dayLabel: string | null;
  startTime: string;
  endTime: string;
  location: string | null;
  meetingPoint: string | null;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  capacity: number;
  seatsTaken: number;
  seatsLeft: number;
};

export type ActivityImageItem = {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
  isCover: boolean;
};

export type ActivityDetail = {
  templateId: string;
  slug: string;
  name: string;
  description: string | null;
  category: ActivityCategory;
  coverImageUrl: string | null;
  images: ActivityImageItem[];
  occurrences: ActivityListItem[];
};

export type NewsPost = {
  id: string;
  slug: string;
  title: string;
  body: string;
  imageUrl: string | null;
  pinned: boolean;
  publishedAt: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NewsListResponse = {
  data: NewsPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type SponsorTier = "gold" | "silver" | "bronze";

export type Sponsor = {
  id: string;
  name: string;
  logoUrl: string;
  url: string | null;
  tier: SponsorTier;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type FestivalDay = {
  id: string;
  date: string;
  label: string | null;
  sortOrder: number;
};

export type ActivityCategory =
  | "workshop"
  | "adventure"
  | "music"
  | "food"
  | "wellness"
  | "cultural";

export type GallerySection = "live" | "workshops" | "adventures" | "food";

export type GalleryImage = {
  id: string;
  url: string;
  alt: string;
  title: string | null;
  caption: string | null;
  section: GallerySection;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type GalleryListResponse = {
  data: GalleryImage[];
  pagination: Pagination;
};

export type RegistrationLookup = {
  fullName: string;
  phone: string;
} | null;

export type CreateRegistrationBody = {
  email: string;
  fullName: string;
  phone: string;
  festivalDayId: string;
  occurrenceIds: string[];
  responsibilityAccepted: true;
  notifyIfAbsent: boolean;
};

export type CreateRegistrationResponse = {
  id: string;
  email: string;
  date: string;
  festivalDayId: string;
  activities: string[];
};

export type ApiError = {
  code: string;
  message: string;
  occurrenceId?: string;
  conflictA?: string;
  conflictB?: string;
};
