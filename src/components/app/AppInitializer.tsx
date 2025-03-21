import { ReactNode, useEffect } from "react";
import store from "@/store";

interface AppInitializerProps {
  children: ReactNode;
}

export const AppInitializer = ({ children }: AppInitializerProps) => {
  useEffect(() => {
    // Initialize auth state
    store.getActions().auth.restoreAuth();
    
    // Initialize theme
    store.getActions().theme.initTheme();
  }, []);
  
  return <>{children}</>;
}; 