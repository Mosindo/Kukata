import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { USERCATEGORY } from "@prisma/client";
import React from "react";

type MUISelectChangeEvent = React.ChangeEvent<{
  name?: string;
  value: unknown;
}> & {
  target: { value: USERCATEGORY };
};
type InputChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;
interface AuthModalInputsProps {
  inputs: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    city: string;
    password: string;
    role: USERCATEGORY;
  };

  // eslint-disable-next-line no-unused-vars
  handleInputChange: (e: InputChangeEvent | MUISelectChangeEvent) => void;

  isSignin: boolean;
}

const userCategories = {
  CUSTOMER: "CUSTOMER",
  OWNER: "OWNER",
  STYLIST: "STYLIST",
};

const AuthModalInputs = ({
  inputs,
  handleInputChange,
  isSignin,
}: AuthModalInputsProps) => {
  console.log("inputs:", inputs);
  return (
    <div>
      {isSignin ? null : (
        <Select
          value={inputs.role}
          name="role"
          onChange={handleInputChange as any}
        >
          {Object.values(userCategories).map((category) => (
            <MenuItem key={category} value={category}>
              {category.toLowerCase()}
            </MenuItem>
          ))}
        </Select>
      )}
      {isSignin ? null : (
        <div className="my-3 flex justify-between text-sm">
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%]"
            placeholder="First Name"
            value={inputs.firstName}
            onChange={handleInputChange}
            name="firstName"
          />
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%]"
            placeholder="Last Name"
            value={inputs.lastName}
            onChange={handleInputChange}
            name="lastName"
          />
        </div>
      )}
      <div className="my-3 flex justify-between text-sm">
        <input
          type="text"
          className="border rounded p-2 py-3 w-full"
          placeholder="Email"
          value={inputs.email}
          onChange={handleInputChange}
          name="email"
        />
      </div>
      {isSignin ? null : (
        <div className="my-3 flex justify-between text-sm">
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%]"
            placeholder="Phone"
            value={inputs.phoneNumber}
            onChange={handleInputChange}
            name="phoneNumber"
          />
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%]"
            placeholder="City"
            value={inputs.city}
            onChange={handleInputChange}
            name="city"
          />
        </div>
      )}
      <div className="my-3 flex justify-between text-sm">
        <input
          type="password"
          className="border rounded p-2 py-3 w-full"
          placeholder="Password"
          value={inputs.password}
          onChange={handleInputChange}
          name="password"
        />
      </div>
    </div>
  );
};

export default AuthModalInputs;
