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
    setAuthState({
      data: null,
      error: null,
      loading: false,
    });
    router.refresh();
  };
  // Dans votre composant
  const [selectedRole, setSelectedRole] = useState<USERCATEGORY>("CUSTOMER");

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
          console.log("session:", selectedRole);
          googleSignIn(session.user, selectedRole);
        }
      }
    );

    return () => {
      data.subscription.unsubscribe();
    };
  }, [selectedRole]);

  // Dans votre hook useAuth
  const googleSignIn = async (user: any, role: USERCATEGORY) => {
    const userData = {
      userId: user.id,
      email: user.email,
      firstName: user.user_metadata.name,
      lastName: "",
      role: role,
      phoneNumber: user.phone,
    };
    try {
      const response = await axios.post(
        `http://localhost:3000/api/${role.toLowerCase()}`,
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
    googleSignIn,
  };
};

export default useAuth;
