"use client";

import { useState, createContext, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Session, User } from "@supabase/supabase-js";

interface State {
  data: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthState extends State {
  setAuthState: React.Dispatch<React.SetStateAction<State>>;
}

export const AuthenticationContext = createContext<AuthState>({
  data: null,
  loading: false,
  error: null,
  setAuthState: () => ({}),
});

const AuthContext = ({ children }: { children: React.ReactNode }) => {
  const [AuthState, setAuthState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchUser = async () => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return setAuthState({
          data: null,
          error: null,
          loading: false,
        });
      }

      const userId = session.user.id;
      let userData;

      // Check in 'customer' table
      const { data: customerData } = await supabase
        .from("Customer")
        .select("*")
        .eq("id", userId);
      if (customerData && customerData.length > 0) {
        userData = customerData[0];
      }

      // Check in 'owner' table if not found in 'customer'
      if (!userData) {
        const { data: ownerData } = await supabase
          .from("Owner")
          .select("*")
          .eq("id", userId);
        if (ownerData && ownerData.length > 0) {
          userData = ownerData[0];
        }
      }

      // Check in 'stylist' table if not found in 'customer' and 'owner'
      if (!userData) {
        const { data: stylistData } = await supabase
          .from("Stylist")
          .select("*")
          .eq("id", userId);
        if (stylistData && stylistData.length > 0) {
          userData = stylistData[0];
        }
      }

      if (userData) {
        setAuthState({
          data: userData,
          error: null,
          loading: false,
        });
      } else {
        setAuthState({
          data: null,
          error: "User not found",
          loading: false,
        });
      }
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthenticationContext.Provider value={{ ...AuthState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthContext;
