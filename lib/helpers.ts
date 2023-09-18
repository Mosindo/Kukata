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

export const fetchCustomerByUserId = async (
  id: string
): Promise<CustomerType> => {
  if (!id) {
    throw new Error("No user ID provided");
  }

  try {
    // Fetch all customers
    const response = await axios.get(`http://localhost:3000/api/customer`);

    if (response.status === 200) {
      const customers: CustomerType[] = response.data;

      // Find the customer with the correct userId
      const customer = customers.find((customer) => customer.userId === id);

      if (customer) {
        return customer;
      }

      throw new Error("No customer found with that ID");
    }

    throw new Error("Error fetching customers");
  } catch (error) {
    throw new Error(`Error fetching customer: ${error}`);
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
