"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [department, setDepartment] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      // Example: get department from user metadata or email domain
      setDepartment(data.user?.user_metadata?.department || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setDepartment(session?.user?.user_metadata?.department || null);
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  return (
    <AuthContext.Provider value={{ user, department }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
