import { useQuery } from "@tanstack/react-query";
import type { HotelType } from "../../shared/types";

export const useUserHotels = () =>
  useQuery({
    queryKey: ["user-hotels"],
    queryFn: async (): Promise<HotelType[]> => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/my-hotels`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Error getting hotels");

      const data = await res.json();

      return data.data.userHotels;
    },
  });

export const useUserHotel = (id: string) =>
  useQuery({
    queryKey: ["user-hotels", id],
    queryFn: async (): Promise<HotelType> => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/my-hotels/${id}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Error getting hotel");

      const data = await res.json();

      return data.data.hotel;
    },
  });
