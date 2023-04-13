import React from "react";

const header = ({ name }: { name: string }) => {
  const renderName = () => {
    const nameArray = name.split("-");

    return nameArray.join(" ");
  };
  return (
    <div className="h-96 overflow-hidden">
      <div className="bg-center bg-gradient-to-r from-[#0f1f47] to-[#5f6984] h-full flex justify-center items-center">
        <h1 className="text-7xl text-white capitalize text-shadow text-center">
          {renderName()}
        </h1>
      </div>
    </div>
  );
};

export default header;
