import { createContext, useContext, useState } from "react";

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  // Esto es suficiente para que ProtectedRoute y WelcomeModal no exploten.
  const [role, setRole] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        showWelcomeModal,
        setShowWelcomeModal,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
