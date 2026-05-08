export type ActivityListItem = {
  occurrenceId: string;
  templateId: string;
  slug: string;
  name: string;
  description: string | null;
  category: ActivityCategory;
  date: string;
  startTime: string;
  endTime: string;
  location: string | null;
  meetingPoint: string | null;
  capacity: number;
  seatsTaken: number;
  seatsLeft: number;
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
  date: string;
  occurrenceIds: string[];
  responsibilityAccepted: true;
  notifyIfAbsent: boolean;
};

export type CreateRegistrationResponse = {
  id: string;
  email: string;
  date: string;
  activities: string[];
};

export type ApiError = {
  code: string;
  message: string;
  occurrenceId?: string;
  conflictA?: string;
  conflictB?: string;
};
