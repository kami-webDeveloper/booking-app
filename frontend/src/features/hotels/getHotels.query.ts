import { useQuery } from "@tanstack/react-query";
import type {
  HotelSearchResponse,
  HotelType,
  SearchParams,
} from "../../shared/types";

export const useSearchHotels = (searchParams: SearchParams) => {
  return useQuery<HotelSearchResponse, Error>({
    queryKey: ["hotels", searchParams],
    queryFn: async ({ queryKey }): Promise<HotelSearchResponse> => {
      const [, params] = queryKey as ["hotels", SearchParams];

      const queryParams = new URLSearchParams({
        destination: params.destination ?? "",
        checkIn: params.checkIn ?? "",
        checkOut: params.checkOut ?? "",
        adultCount: params.adultCount ?? "",
        childCount: params.childCount ?? "",
        page: params.page ?? "",
        maxPrice: params.maxPrice || "",
        sortOption: params.sortOption || "",
      });

      params.stars?.forEach((star) => queryParams.append("stars", star));

      params.facilities?.forEach((facility) =>
        queryParams.append("facilities", facility)
      );

      params.types?.forEach((type) => queryParams.append("types", type));

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/hotels/search?${queryParams}`
      );

      if (!response.ok) throw new Error("Error fetching hotels");

      const data = await response.json();

      return data.data;
    },
  });
};

export const useHotel = (hotelId: string) =>
  useQuery<HotelType>({
    queryKey: ["hotel", hotelId],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/hotels/${hotelId}`
      );

      if (!res.ok) throw new Error("Error fetching the hotel");

      const data = await res.json();

      return data.data.hotel;
    },
    enabled: !!hotelId,
  });
