// pages/api/deleteAllUsers.ts
import prisma from "../../lib/prisma";
import { supabase } from "../../lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    // Fetch all users from each category from your Prisma database
    const customers = await prisma.customer.findMany();
    const owners = await prisma.owner.findMany();
    const stylists = await prisma.stylist.findMany();

    // Combine all users into one array
    const users = [...customers, ...owners, ...stylists];

    // Check if there are no users to delete
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    for (let user of users) {
      try {
        // Delete related data from Prisma based on user role
        switch (user.role) {
          case "CUSTOMER":
            await prisma.customer.delete({
              where: { id: user.id },
            });
            break;
          case "OWNER":
            await prisma.owner.delete({
              where: { id: user.id },
            });
            break;
          case "STYLIST":
            await prisma.stylist.delete({
              where: { id: user.id },
            });
            break;
          default:
            console.log(`Unknown user role for user ${user.id}`);
        }

        // Delete user from Supabase
        const { error } = await supabase.auth.admin.deleteUser(user.id);

        if (error) {
          console.error("Error deleting user from Supabase:", error);
          return res
            .status(500)
            .json({ error: `Error deleting user ${user.id} from Supabase.` });
        }
      } catch (err) {
        console.error(`Error deleting user ${user.id}: `, err);
        return res
          .status(500)
          .json({ error: `Error deleting user ${user.id}.` });
      }
    }

    return res.status(200).json({ message: "All users deleted successfully." });
  } else {
    // Handle any other HTTP method
    res.status(405).json({ error: "Method not allowed." });
  }
}
