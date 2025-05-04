import { createContext, useState } from "react";

export const CargasAlerts = createContext();

export function CargasAlertsProvider({ children }) {
  const [loading, setLoading] = useState(false);

  const Loader = () => (
    <div className="flex items-center justify-center gap-1 min-w-full h-20 mt-20">
      <div className="h-15 w-15 animate-spin rounded-full border-2 border-[var(--color-base-oscuro)] border-t-transparent"></div>
    </div>
  );

  return (
    <CargasAlerts.Provider value={{ loading, setLoading, Loader }}>
      {children} {/* Renderiza el resto de la app */}
    </CargasAlerts.Provider>
  );
}