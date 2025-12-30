import { useMutation } from "@tanstack/react-query";
import type {
  CreatePaymentIntentPayload,
  CreatePaymentIntentResponse,
} from "../../shared/types";
import { useAppContext } from "../../context/AppContext";

const useCreatePaymentIntent = (hotelId: string) => {
  const { showToast } = useAppContext();

  return useMutation<
    CreatePaymentIntentResponse,
    Error,
    CreatePaymentIntentPayload
  >({
    mutationFn: async (payload) => {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/hotels/${hotelId}/bookings/payment-intent`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.message || "Failed to create payment intent");
      }

      return res.json();
    },
    onSuccess: (data) => {
      const authority = data.data.authority;

      window.location.href = `https://sandbox.zarinpal.com/pg/StartPay/${authority}`;
    },
    onError: (err: Error) => {
      showToast({
        message: err.message || "Failed to create payment intent",
        type: "ERROR",
      });
    },
  });
};

export default useCreatePaymentIntent;
