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
        console.error(errorAuth);
      } else if (data.session !== null) {
        // Set the cookie options
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
        data.session.expires_at = expiresAt.getTime();
        await supabase.auth.setSession(data.session);

        console.log("User details:", data.user);
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
      } else if (data.session !== null) {
        // Set the cookie options
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
        data.session.expires_at = expiresAt.getTime();
        await supabase.auth.setSession(data.session);

        console.log("User details:", data.user);
      }
      router.refresh();
      const storedRole = localStorage.getItem("selectedRole") as USERCATEGORY;
      const role = storedRole ? storedRole : USERCATEGORY.CUSTOMER;
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
          userId: data?.user?.id,
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
      localStorage.removeItem("selectedRole");
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
    router.push("/");
  };
  // Dans votre composant
  const [selectedRole, setSelectedRole] = useState<USERCATEGORY>("CUSTOMER");
  const [user, setUser] = useState();

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
          const { user } = session;
          console.log("user:", user);
          // Create a profile for the user
          googleSignup(user);
        }
      }
    );

    return () => {
      data.subscription.unsubscribe();
    };
  }, [selectedRole]);

  // Dans votre hook useAuth
  const googleSignup = async (user: any) => {
    const storedRole = localStorage.getItem("selectedRole") as USERCATEGORY;
    const role = storedRole ? storedRole : USERCATEGORY.CUSTOMER;
    const userData = {
      userId: user.id,
      email: user.email,
      firstName: user.user_metadata.name,
      lastName: "",
      role: role,
      phoneNumber: user.phone,
    };
    console.log("googleSignIn role:", role);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/${role.toLowerCase()}`,
        userData
      );
      localStorage.removeItem("selectedRole");
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
    user,
    setSelectedRole,
  };
};

export default useAuth;
