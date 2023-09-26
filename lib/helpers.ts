import axios from "axios";
import { USERCATEGORY } from "@prisma/client";

export interface FormData {
  role: string | USERCATEGORY;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  city: string;
}

export interface StepProps {
  nextStep: () => void;
  prevStep?: () => void;
  handleChange: (input: string, value: string) => void;
  values?: FormData;
}

interface CustomerType {
  id: string;
  firstName: string;
  lastName: string;
  userId: string;
}

export const fetchUserRolesById = async (id: string) => {
  if (!id) {
    throw new Error("No user ID provided");
  }

  try {
    const [costumerResponse, ownerResponse, stylistResponse] =
      await Promise.all([
        axios.get(`http://localhost:3000/api/customer/${id}`),
        axios.get(`http://localhost:3000/api/owner/${id}`),
        axios.get(`http://localhost:3000/api/stylist/${id}`),
      ]);

    const rolesData = {
      customer: costumerResponse.data || null,
      owner: ownerResponse.data || null,
      stylist: stylistResponse.data || null,
    };

    // Check if user has any role
    if (!rolesData.customer && !rolesData.owner && !rolesData.stylist) {
      throw new Error("User not found");
    }

    // Filter out roles with null values
    const filteredRolesData = Object.fromEntries(
      Object.entries(rolesData).filter(([_, value]) => value !== null)
    );

    return filteredRolesData;
  } catch (error) {
    throw new Error(`Error fetching user roles: ${error}`);
  }
};

export const validateRequestBodyFields = (
  req: Request,
  validFields: string[]
) => {
  const keys = Object.keys(req.json);
  for (let key of keys) {
    if (!validFields.includes(key)) {
      return { isValid: false, invalidField: key };
    }
  }
  return { isValid: true };
};
