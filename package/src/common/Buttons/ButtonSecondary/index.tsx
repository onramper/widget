import React from "react";
import styles from "./styles.module.css";

type ButtonActionType = {
  onClick?: () => void;
  text: string;
  disabled?: boolean;
  size?: "small" | "large";
  className?: string;
  primary?: boolean;
};

export const ButtonSecondary: React.FC<ButtonActionType> = (props) => {
  const {
    onClick,
    text,
    disabled = false,
    size = "large",
    className = "",
    primary,
  } = props;

  return (
    <button
      onClick={onClick}
      className={`${styles["button-action"]} ${
        size === "small" ? styles["button-action--small"] : ""
      } ${primary ? styles["primary"] : ""} ${className}`}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
