import React from "react";
import { StepProps } from "../../../lib/helpers";

const AdditionalInfo: React.FC<StepProps> = ({
  nextStep,
  prevStep,
  handleChange,
  values,
}) => {
  return (
    <div>
      <h2>Additional Information</h2>
      <input
        placeholder="Phone Number"
        onChange={(e) => handleChange("phoneNumber", e.target.value)}
        // defaultValue={values.phoneNumber}
      />
      <input
        placeholder="City"
        onChange={(e) => handleChange("city", e.target.value)}
        // defaultValue={values.city}
      />
      <button onClick={prevStep}>Back</button>
      <button onClick={nextStep}>Next</button>
    </div>
  );
};

export default AdditionalInfo;
