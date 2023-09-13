"use client";

import React, { useEffect, useState, useContext } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AuthModalInputs from "./AuthModalInputs";
import useAuth from "../../hooks/useAuth";
import { AuthenticationContext } from "../context/AuthContext";
import { Alert, CircularProgress, SelectChangeEvent } from "@mui/material";
import { USERCATEGORY } from "@prisma/client";
import { supabase } from "../../lib/supabase";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const AuthModal = ({ isSignin }: { isSignin: boolean }) => {
  const { error, loading, data } = useContext(AuthenticationContext);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { signin, signup, handleRoleSelection, selectedRole, googleSignIn } =
    useAuth();
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    password: "",
    phoneNumber: "",
    role: USERCATEGORY.CUSTOMER,
  });

  const [disabled, setDisabled] = useState(true);

  const renderContent = (signinContent: string, signupContent: string) => {
    return isSignin ? signinContent : signupContent;
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setInputs({
      ...inputs,
      [e.target.name as string]: e.target.value as USERCATEGORY,
    });
  };

  useEffect(() => {
    if (isSignin) {
      if (inputs.password && inputs.email) {
        return setDisabled(false);
      }
    } else {
      if (
        inputs.firstName &&
        inputs.lastName &&
        inputs.email &&
        inputs.password &&
        inputs.city &&
        inputs.phoneNumber
      ) {
        return setDisabled(false);
      }
    }

    setDisabled(true);
  }, [inputs, isSignin]);

  const handleClick = () => {
    if (isSignin) {
      signin({ email: inputs.email, password: inputs.password }, handleClose);
    } else {
      signup(inputs, handleClose);
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as USERCATEGORY;
    handleRoleSelection(role);
    console.log("Selected role:", role);
  };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    console.log("data", data);
    await googleSignIn(data, "CUSTOMER");
    // if (error) {
    //   console.error(error);
    // } else if (data.session !== null) {
    //   // Set the cookie options
    //   const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
    //   data.session.expires_at = expiresAt.getTime();
    //   await supabase.auth.setSession(data.session);

    //   console.log("User details:", data);

    //   // Create the corresponding user in your database
    //   const { data: ownerData, error: ownerError } = await supabase
    //     .from("Owner")
    //     .insert({ email: user.email })
    //     .single();

    //   if (ownerError) {
    //     console.error(ownerError);
    //   } else {
    //     console.log("Owner details:", ownerData);
    //   }

    //   const { data: stylistData, error: stylistError } = await supabase
    //     .from("Stylist")
    //     .insert({ email: user.email })
    //     .single();

    //   if (stylistError) {
    //     console.error(stylistError);
    //   } else {
    //     console.log("Stylist details:", stylistData);
    //   }

    //   const { data: customerData, error: customerError } = await supabase
    //     .from("Customer")
    //     .insert({ email: user.email })
    //     .single();

    //   if (customerError) {
    //     console.error(customerError);
    //   } else {
    //     console.log("Customer details:", customerData);
    //   }
    // }
  };

  // Listen for changes in the authentication state
  // supabase.auth.onAuthStateChange((event, session) => {
  //   if (event === "SIGNED_IN") {
  //     // Create the corresponding user in your database
  //     const { user } = session;
  //     const { data: ownerData, error: ownerError } = await supabase
  //       .from("Owner")
  //       .insert({ email: user.email })
  //       .single();

  //     if (ownerError) {
  //       console.error(ownerError);
  //     } else {
  //       console.log("Owner details:", ownerData);
  //     }

  //     const { data: stylistData, error: stylistError } = await supabase
  //       .from("Stylist")
  //       .insert({ email: user.email })
  //       .single();

  //     if (stylistError) {
  //       console.error(stylistError);
  //     } else {
  //       console.log("Stylist details:", stylistData);
  //     }

  //     const { data: customerData, error: customerError } = await supabase
  //       .from("Customer")
  //       .insert({ email: user.email })
  //       .single();

  //     if (customerError) {
  //       console.error(customerError);
  //     } else {
  //       console.log("Customer details:", customerData);
  //     }
  //   }
  // });

  return (
    <div>
      <button
        className={`${renderContent(
          "bg-blue-400 text-white",
          ""
        )} border p-1 px-4 rounded mr-3`}
        onClick={handleOpen}
      >
        {renderContent("Sign in", "Sign up")}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {loading ? (
            <div className="py-24 px-2 h-[600px] flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <div className="p-2 h-[-600px]">
              {error ? (
                <Alert severity="error" className="mb-4">
                  {error}
                </Alert>
              ) : null}

              <div className="uppercase font-bold text-center pb-2 border-bottom mb-2">
                <p className="text-sm">
                  {renderContent("Sign In", "Create Account")}
                </p>
              </div>
              <div className="m-auto">
                <h2 className="text-2xl font-light text-center">
                  {renderContent(
                    "Log Into Your Account",
                    "Create Your Kukata Account"
                  )}
                </h2>
                <AuthModalInputs
                  inputs={inputs}
                  handleChangeInput={handleChangeInput}
                  handleSelectChange={handleSelectChange}
                  isSignin={isSignin}
                />
                <button
                  className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
                  disabled={disabled}
                  onClick={handleClick}
                >
                  {renderContent("Sign In", "Create Account")}
                </button>
              </div>
              <hr className="my-5" />
              <select onChange={handleRoleChange} value={selectedRole}>
                <option value={USERCATEGORY.CUSTOMER}>Customer</option>
                <option value={USERCATEGORY.OWNER}>Owner</option>
              </select>
              <button onClick={handleGoogleSignIn}>
                Se connecter avec Google
              </button>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};
export default AuthModal;
