import React from "react";
import { StepProps } from "../../../lib/helpers";

const RoleSelection: React.FC<StepProps> = ({ nextStep, handleChange }) => {
  return (
    <div>
      <h2>Select your role</h2>
      <select onChange={(e) => handleChange("role", e.target.value)}>
        <option value="CUSTOMER">Customer</option>
        <option value="OWNER">Owner</option>
      </select>
      <button onClick={nextStep}>Next</button>
    </div>
  );
};

export default RoleSelection;
