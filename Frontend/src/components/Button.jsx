import React from "react";

// Generic Button wrapper that preserves existing visuals by merging
// a tiny default with any provided className and forwarding props.
const Button = ({ children, className = "", onClick, type = "button", disabled = false, ...rest }) => {
  const base = "inline-flex items-center justify-center"; // lightweight default
  const combined = `${base} ${className}`.trim();
  return (
    <button type={type} className={combined} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};

export default Button;
