import { useQuery } from "@tanstack/react-query";

const useValidateToken = () =>
  useQuery({
    queryKey: ["validateToken"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/validate-token`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Token invalid");

      const data = await res.json();

      return data.data.user;
    },
    retry: false,
  });

export default useValidateToken;
