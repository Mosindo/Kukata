import React from "react";
import { StepProps } from "../../../lib/helpers";

const BasicInfo: React.FC<StepProps> = ({
  nextStep,
  prevStep,
  handleChange,
  values,
}) => {
  return (
    <div>
      <h2>Basic Information</h2>
      <input
        placeholder="First Name"
        onChange={(e) => handleChange("firstName", e.target.value)}
        // defaultValue={values.firstName}
      />
      <input
        placeholder="Last Name"
        onChange={(e) => handleChange("lastName", e.target.value)}
        // defaultValue={values.lastName}
      />
      <input
        placeholder="Email"
        onChange={(e) => handleChange("email", e.target.value)}
        // defaultValue={values.email}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => handleChange("password", e.target.value)}
        // defaultValue={values.password}
      />
      <button onClick={prevStep}>Back</button>
      <button onClick={nextStep}>Next</button>
    </div>
  );
};

export default BasicInfo;
