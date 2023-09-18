import React from "react";
import { FormData } from "../../../lib/helpers";

interface ConfirmationProps {
  values: FormData;
}

const Confirmation: React.FC<ConfirmationProps> = ({ values }) => {
  return (
    <div>
      <h2>Confirmation</h2>
      <ul>
        <li>Role: {values.role}</li>
        <li>First Name: {values.firstName}</li>
        <li>Last Name: {values.lastName}</li>
        <li>Email: {values.email}</li>
        <li>Phone Number: {values.phoneNumber}</li>
        <li>City: {values.city}</li>
      </ul>
      <button>Submit</button>
    </div>
  );
};

export default Confirmation;
