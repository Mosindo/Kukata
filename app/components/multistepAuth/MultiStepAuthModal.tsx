import React, { useState } from "react";

import { USERCATEGORY } from "@prisma/client";
import RoleSelection from "./RoleSelection";
import BasicInfo from "./BasicInfo";
import AdditionalInfo from "./AdditionalInfo";
import Confirmation from "./Confirmation";

const MultiStepAuthModal = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    city: "",
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const handleChange = (input: string, value: string) => {
    if (input === "role") {
      setFormData({ ...formData, [input]: value as USERCATEGORY });
    } else {
      setFormData({ ...formData, [input]: value });
    }
  };

  switch (step) {
    case 1:
      return <RoleSelection nextStep={nextStep} handleChange={handleChange} />;
    case 2:
      return (
        <BasicInfo
          nextStep={nextStep}
          prevStep={prevStep}
          handleChange={handleChange}
          values={formData}
        />
      );
    case 3:
      return (
        <AdditionalInfo
          nextStep={nextStep}
          prevStep={prevStep}
          handleChange={handleChange}
          values={formData}
        />
      );
    case 4:
      return <Confirmation values={formData} />;
    default:
      return null;
  }
};

export default MultiStepAuthModal;
