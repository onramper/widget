import React from "react";
import Spinner from "../../Spinner";
import styles from "./styles.module.css";

type ButtonActionType = {
  onClick?: () => void;
  text: string;
  disabled?: boolean;
  size?: "small" | "large";
  className?: string;
  pending?: boolean;
};

export const ButtonAction: React.FC<ButtonActionType> = (props) => {
  const {
    onClick,
    text,
    disabled = false,
    size = "large",
    className = "",
    pending = false,
  } = props;

  return (
    <button
      onClick={onClick}
      className={`${styles["button-action"]} ${
        size === "small" ? styles["button-action--small"] : ""
      } ${className} ${pending ? styles.pending : ""} `}
      disabled={disabled}
    >
      {text}
      {pending && <Spinner className={styles.spinner} />}
    </button>
  );
};
