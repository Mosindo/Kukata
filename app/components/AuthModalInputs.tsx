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

  // eslint-disable-next-line no-unused-vars
  handleChangeInput: (
    // eslint-disable-next-line no-unused-vars
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
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
  isSignin,
}: AuthModalInputsProps) => {
  return (
    <div>
      {isSignin ? null : (
        <select
          value={inputs.role}
          onChange={handleChangeInput}
          className="border rounded p-2 py-3 w-[49%]"
        >
          {Object.values(userCategories).map((category) => (
            <option key={category} value={category}>
              {category.toLowerCase()}
            </option>
          ))}
        </select>
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
          onChange={handleChangeInput}
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
