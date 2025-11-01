import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center" style={{ height: "70vh" }}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#58a6ff]"></div>
    </div>
  );
};

export default Loader;
