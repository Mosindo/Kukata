"use client";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import AuthModal from "./AuthModal";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { AuthenticationContext } from "../context/AuthContext";
import useAuth from "../../hooks/useAuth";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { Database } from "../../lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const Navbar = () => {
  const { data: user, loading, error } = useContext(AuthenticationContext);
  const { signout } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [media, setMedia] = React.useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const open = Boolean(anchorEl);
  const supabase = createClientComponentClient<Database>();
  const CDNURL =
    "https://ufczslyhktxdabgthvbi.supabase.co/storage/v1/object/public/avatars/";

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getImages = async () => {
    const { data, error } = await supabase.storage
      .from("avatars")
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (data) {
      setMedia(data);
      setIsLoading(false);
    } else {
      console.log(error);
      setIsLoading(false);
    }
    console.log("data", data);
  };

  useEffect(() => {
    getImages();
  }, [user, loading]);

  //solution to fix cache issu
  const imageUrl = `${
    CDNURL + user?.id + "/" + media[0]?.name
  }?t=${new Date().getTime()}`;

  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link
        href="/"
        className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#11998e]  to-[#38ef7d] text-2xl"
      >
        Kukata
      </Link>
      <div>
        <div className="flex">
          {isLoading ? null : (
            <div className="flex">
              {user ? (
                <>
                  {media.length > 0 ? (
                    <pre>
                      <div
                        className="w-12 rounded-full overflow-hidden  h-12"
                        onClick={handleMenu}
                      >
                        <Image
                          src={imageUrl}
                          alt="avatar"
                          width={50}
                          height={50}
                          placeholder="blur"
                          blurDataURL={imageUrl}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    </pre>
                  ) : (
                    <IconButton
                      size="large"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="inherit"
                    >
                      <AccountCircle />
                    </IconButton>
                  )}
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <Link href={`/profile`}>
                      <MenuItem onClick={handleClose}>Profile</MenuItem>
                    </Link>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={signout}>Sign out</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <AuthModal isSignin={true} />
                  <AuthModal isSignin={false} />
                  <Button variant="contained" color="primary" onClick={signout}>
                    Signout
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
