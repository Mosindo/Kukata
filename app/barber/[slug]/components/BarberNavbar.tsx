import Link from "next/link";
import React from "react";

const BarberNavbar = () => {
  return (
    <nav className="flex text-reg border-b pb-2">
      <Link href="/barber/bobo" className="mr-7">
        Overview
      </Link>
      <Link href="/barber/bobo/services" className="mr-7">
        Services
      </Link>
    </nav>
  );
};

export default BarberNavbar;
