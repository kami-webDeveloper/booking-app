import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RegisterFormData } from "../../pages/Register";
import { useAppContext } from "../../context/AppContext";
import { useLocation, useNavigate } from "react-router";
import type { SignInFormData } from "../../pages/Signin";

type AuthAction = "register" | "login";

type AuthFormDataMap = {
  register: RegisterFormData;
  login: SignInFormData;
};

export default function useAuthUser<A extends AuthAction>(action: A) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();

  return useMutation({
    mutationFn: async (formData: AuthFormDataMap[A]) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${action}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.status !== "success") {
        throw new Error(
          typeof data.message === "string"
            ? data.message
            : data.message?.join(", ") || "Request failed"
        );
      }

      return data;
    },

    onSuccess: async () => {
      const message =
        action === "register"
          ? "Registration successful"
          : "Logged in successfully";

      showToast({ message, type: "SUCCESS" });

      await queryClient.invalidateQueries({
        queryKey: ["validateToken"],
      });

      navigate(location.state?.from || "/", { replace: true });

      if (!location.state) setTimeout(() => window.location.reload(), 1000);
    },

    onError: (err: Error) => {
      const fallback =
        action === "register" ? "Registration failed" : "Login failed";

      showToast({
        message: err.message || fallback,
        type: "ERROR",
      });
    },
  });
}
