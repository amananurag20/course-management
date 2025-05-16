import React, { createContext, useState, useContext } from "react";

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isGlobalSidebarOpen, setIsGlobalSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsGlobalSidebarOpen(!isGlobalSidebarOpen);
  };

  return (
    <SidebarContext.Provider value={{ isGlobalSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
