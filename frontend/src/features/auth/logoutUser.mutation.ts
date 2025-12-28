import { useMutation } from "@tanstack/react-query";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router";

export default function useLogoutUser() {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/logout`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to logout");
    },
    onSuccess: () => {
      showToast({
        message: "You signed out successfully",
        type: "SUCCESS",
      });

      navigate("/sign-in");

      setTimeout(() => window.location.reload(), 1000);
    },
    onError: (err: Error) => {
      showToast({
        message: err.message || "Failed to sign out. try again later.",
        type: "ERROR",
      });
    },
  });
}
