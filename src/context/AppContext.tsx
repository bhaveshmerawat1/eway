"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import localUsers from "../utils/appData.json";

interface AppContextType {
  
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {



  // ✅ Initial load
  useEffect(() => {
   
  }, []);

  return (
    <AppContext.Provider
      value={{
      
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
