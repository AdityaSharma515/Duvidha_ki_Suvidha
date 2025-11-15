import { FaInbox } from "react-icons/fa";
import React from "react";



const NoComplaintAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fadeIn">
      
      <div className="p-6 rounded-full bg-[#21262d] border border-[#30363d] animate-pulse">
        <FaInbox size={50} className="text-[#58a6ff]" />
      </div>

      <h3 className="text-[#c9d1d9] text-lg mt-4 font-medium">
        No Complaints Found
      </h3>

      <p className="text-[#8b949e] text-sm mt-1">
        Everything looks peaceful for now.
      </p>

    </div>
  );
};

export default NoComplaintAnimation;
