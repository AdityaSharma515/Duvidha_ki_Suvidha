import React, { useState } from "react";

const InstructionsPopup = ({ buttonLabel = "Instructions", children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
     
     {/* Clickable Text */}
<p
  onClick={() => setOpen(true)}
  className="text-[#58a6ff] hover:underline cursor-pointer text-sm font-medium"
>
  {buttonLabel}
</p>


      {/* Popup Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 max-w-md w-full shadow-xl relative text-[#c9d1d9]">

            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-[#8b949e] hover:text-white text-lg"
            >
              ✖
            </button>

            {/* Content */}
            <div className="space-y-3">
              {children}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default InstructionsPopup;
