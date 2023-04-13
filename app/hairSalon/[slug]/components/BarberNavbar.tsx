import Link from "next/link";
import React from "react";

const BarberNavbar = ({ slug }: { slug: string }) => {
  return (
    <nav className="flex text-reg border-b pb-2">
      <Link href={`/hairSalon/${slug}`} className="mr-7">
        Overview
      </Link>
      <Link href={`/hairSalon/${slug}/services`} className="mr-7">
        Services
      </Link>
    </nav>
  );
};

export default BarberNavbar;
