// pages/api/deleteUser.js
import prisma from "../../../lib/prisma";
import { supabase } from "../../../lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { userId, role } = req.body;

    // Delete user from Supabase
    const { error } = await supabase.auth.admin.deleteUser(userId);

    // if (error) {
    //   console.error("Error deleting user from Supabase:", error);
    //   return res
    //     .status(500)
    //     .json({ error: "Error deleting user from Supabase." });
    // }

    // Delete related data from Prisma based on user role
    switch (role) {
      case "CUSTOMER":
        await prisma.customer.delete({
          where: { id: userId },
        });
        break;
      case "OWNER":
        await prisma.owner.delete({
          where: { id: userId },
        });
        break;
      case "STYLIST":
        await prisma.stylist.delete({
          where: { id: userId },
        });
        break;
      default:
        return res.status(400).json({ error: "Unknown user role." });
    }

    return res.status(200).json({ message: "User deleted successfully." });
  } else {
    // Handle any other HTTP method
    res.status(405).json({ error: "Method not allowed." });
  }
}
