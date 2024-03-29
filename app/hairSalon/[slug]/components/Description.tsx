import React from "react";

const Description = ({ description }: { description: string | null }) => {
  return (
    <div className="mt-4">
      <p className="text-lg font-light">{description}</p>
    </div>
  );
};

export default Description;
