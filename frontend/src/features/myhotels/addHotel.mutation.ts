import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router";
import type { HotelFormData } from "../../components/ManageHotelForm";

export default function useAddHotel() {
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

      Array.from(formData.imageFiles).forEach((file) =>
        body.append("imageFiles", file)
      );

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/my-hotels`,
        {
          method: "POST",
          credentials: "include",
          body,
        }
      );

      const data = await res.json();
      if (data.status !== "success") throw new Error(data.message);

      return data;
    },
    onSuccess: async () => {
      showToast({ message: "Hotel added successfully", type: "SUCCESS" });

      await queryClient.invalidateQueries({
        queryKey: ["user-hotels", "hotels"],
      });

      navigate("/my-hotels");
    },
    onError: (err: Error) => {
      showToast({
        message: err.message || "Failed to add hotel. Please try again later.",
        type: "ERROR",
      });
    },
  });
}
