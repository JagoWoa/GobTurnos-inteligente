import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { onAuthStateChange } from "./auth";
import { getUserTurns } from "./turns";

const SupabaseContext = createContext(null);

export function SupabaseProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userTurns, setUserTurns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSupabaseReady, setIsSupabaseReady] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsSupabaseReady(false);
      setLoading(false);
      return;
    }

    // Escuchar cambios de autenticación
    const subscription = onAuthStateChange(async (event, authUser) => {
      try {
        setUser(authUser);

        // Si hay un usuario autenticado, cargar sus turnos
        if (authUser) {
          const turns = await getUserTurns(authUser.id);
          setUserTurns(turns);
        } else {
          setUserTurns([]);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error en SupabaseProvider:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const value = {
    user,
    userTurns,
    loading,
    error,
    isSupabaseReady,
    supabase: isSupabaseConfigured ? supabase : null,
    setUserTurns,
    setError,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase debe usarse dentro de SupabaseProvider");
  }
  return context;
}
