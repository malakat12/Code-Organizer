import React from "react";
import "./style.css";

const Button = ({
  text,
  onClick,
  textColor = "white-text",
}) => {
  return (
    <button
      onClick={onClick}
      className={`button flex center ${textColor}`}
    >
      {text}
    </button>
  );
};

export default Button;
