export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  images: { url: string; publicId: string }[];
  adultCount: number;
  childCount: number;
};

export type HotelType = {
  _id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  images: { url: string; _id: string }[];
  lastUpdated: Date;
};

export type HotelSearchResponse = {
  hotels: HotelType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

export type SearchParams = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childCount?: string;
  page?: string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
};

export type UserType = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
};
