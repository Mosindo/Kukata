import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { USERCATEGORY } from "@prisma/client";
import React from "react";

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

  handleChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // eslint-disable-next-line no-unused-vars
  handleSelectChange: (e: SelectChangeEvent) => void;

  isSignin: boolean;
}

const userCategories = {
  CUSTOMER: "CUSTOMER",
  OWNER: "OWNER",
  STYLIST: "STYLIST",
};

const AuthModalInputs = ({
  inputs,
  handleChangeInput,
  handleSelectChange,
  isSignin,
}: AuthModalInputsProps) => {
  return (
    <div>
      {isSignin ? null : (
        <Select value={inputs.role} name="role" onChange={handleSelectChange}>
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
            onChange={handleChangeInput}
            name="firstName"
          />
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%]"
            placeholder="Last Name"
            value={inputs.lastName}
            onChange={handleChangeInput}
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
          onChange={(e) => {
            handleChangeInput(e as React.ChangeEvent<HTMLInputElement>);
          }}
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
            onChange={handleChangeInput}
            name="phoneNumber"
          />
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%]"
            placeholder="City"
            value={inputs.city}
            onChange={handleChangeInput}
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
          onChange={handleChangeInput}
          name="password"
        />
      </div>
    </div>
  );
};

export default AuthModalInputs;
