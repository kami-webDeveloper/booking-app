import { createContext, useContext, type ReactNode } from "react";
import { toast } from "sonner";
import useValidateToken from "../features/auth/validateToken.query";
import type { UserType } from "../shared/types";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AppContext = {
  showToast: (toastMessages: ToastMessage) => void;
  isLoggedIn: boolean;
  isLoadingValidation: boolean;
  userData: UserType;
};

const AppContext = createContext<AppContext | undefined>(undefined);

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: userData,
    isError,
    isLoading: isLoadingValidation,
  } = useValidateToken();

  const values = {
    showToast: ({ message, type }: { message: string; type: string }) => {
      if (type === "SUCCESS") toast.success(message);
      else if (type === "ERROR") toast.error(message);
    },
    userData,
    isLoggedIn: !isError,
    isLoadingValidation,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
  const appContext = useContext(AppContext);

  if (!appContext)
    throw new Error("useAppContext must be used within an AppContextProvider");

  return appContext;
};

export { AppContextProvider, useAppContext };
