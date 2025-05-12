import { createContext } from "react";
import useData from "./useData/useData";

interface AuthContextType {
  data: {
    accessToken: string;
    setAccessToken: (token: string) => void;
    // Add other data properties as needed
    layoutConfig: any;
    setLayoutConfig: any;
    layoutState: any;
    setLayoutState: any;
    onMenuToggle: () => void;
    showConfigSidebar: () => void;
    showProfileSidebar: () => void;
    isSlim: () => boolean;
    isSlimPlus: () => boolean;
    isHorizontal: () => boolean;
    isDesktop: () => boolean;
    breadcrumbs: any[];
    setBreadcrumbs: (breadcrumbs: any[]) => void;
  };
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

const GlobalProvider = ({ children }: any) => {
  const data = useData();
  return (
    <AuthContext.Provider value={{ data }}>{children}</AuthContext.Provider>
  );
};

export default GlobalProvider;
