import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../app/context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { USERCATEGORY } from "@prisma/client";

const useAuth = () => {
  const { error, setAuthState } = useContext(AuthenticationContext);
  const router = useRouter();

  const signin = async (
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    handleClose: () => void
  ) => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const { data, error: errorAuth } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

      if (errorAuth) {
        console.error("Error creating Supabase user:", errorAuth);
        throw errorAuth;
      }

      const response = await axios.post(
        "http://localhost:3000/api/auth/signin",
        {
          email,
          password,
          data,
        }
      );

      setAuthState({
        data: response.data,
        error: null,
        loading: false,
      });
      router.refresh();
      handleClose();
      router.refresh();
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };
  const signup = async (
    {
      email,
      password,
      firstName,
      lastName,
      city,
      phoneNumber,
      role,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      city: string;
      phoneNumber: string;
      role: string;
    },
    handleClose: () => void
  ) => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const { data, error: errorAuth } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "http://localhost:3000/auth/callback",
          data: {
            firstName,
            lastName,
          },
        },
      });
      if (errorAuth) {
        console.error("Error creating Supabase user:", errorAuth);
        throw errorAuth;
      }
      router.refresh();
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        {
          email,
          password,
          firstName,
          lastName,
          city,
          phoneNumber,
          role,
          data,
        }
      );

      setAuthState({
        data: response.data,
        error: null,
        loading: false,
      });

      if (!error) {
        handleClose();
      }
      router.refresh();
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  const signout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    setAuthState({
      data: null,
      error: null,
      loading: false,
    });
  };
  // Dans votre composant
  const [selectedRole, setSelectedRole] = useState<USERCATEGORY | null>(null);

  // Lorsque l'utilisateur sélectionne un rôle dans la modale
  const handleRoleSelection = (role: USERCATEGORY) => {
    setSelectedRole(role);
    // Fermez la modale si nécessaire
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        if (
          event === "SIGNED_IN" &&
          session.user.app_metadata.provider === "google"
        ) {
          if (selectedRole) {
            handleGoogleSignIn(session.user, selectedRole);
          } else {
            // Affichez la modale de sélection de rôle ou définissez un rôle par défaut
          }
        }
      }
    );

    return () => {
      data.subscription.unsubscribe();
    };
  }, [selectedRole]);

  // Dans votre hook useAuth
  const handleGoogleSignIn = async (user: any, role: USERCATEGORY) => {
    const userData = {
      userId: user.id,
      email: user.email,
      firstName: user.user_metadata.name, // À remplir
      lastName: "", // À remplir
      role: role,
      phoneNumber: user.phone,
      city: user.user_metadata.city,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users",
        userData
      );

      console.log("handlegoogleSignin:", response.data);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return {
    signin,
    signup,
    signout,
    selectedRole,
    handleRoleSelection,
    handleGoogleSignIn,
  };
};

export default useAuth;
