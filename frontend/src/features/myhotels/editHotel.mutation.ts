import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAppContext } from "../../context/AppContext";
import type { HotelFormData } from "../../shared/types";

export const useEditHotel = (id: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();

  return useMutation({
    mutationFn: async (formData: HotelFormData) => {
      const body = new FormData();

      body.append("name", formData.name);
      body.append("city", formData.city);
      body.append("country", formData.country);
      body.append("description", formData.description);
      body.append("type", formData.type);
      body.append("pricePerNight", formData.pricePerNight.toString());
      body.append("starRating", formData.starRating.toString());
      body.append("adultCount", formData.adultCount.toString());
      body.append("childCount", formData.childCount.toString());

      formData.facilities.forEach((facility, index) =>
        body.append(`facilities[${index}]`, facility)
      );

      if (formData.imageFiles)
        Array.from(formData.imageFiles).forEach((file) =>
          body.append("imageFiles", file)
        );

      formData.images.forEach(({ url, publicId }, index) => {
        body.append(`images[${index}][url]`, url);
        body.append(`images[${index}][publicId]`, publicId);
      });

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/my-hotels/${id}`,
        {
          method: "PUT",
          credentials: "include",
          body,
        }
      );

      const data = await res.json();

      if (data.status !== "success") throw new Error(data.message);

      return data;
    },
    onSuccess: async () => {
      showToast({ message: "Hotel edited successfully", type: "SUCCESS" });

      await queryClient.invalidateQueries({
        queryKey: ["user-hotels", "hotels"],
      });

      navigate("/my-hotels");
    },
    onError: (err: Error) => {
      showToast({
        message: err.message || "Failed to edit hotel. Please try again later.",
        type: "ERROR",
      });
    },
  });
};
