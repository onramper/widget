import React from "react";
import styles from "../ButtonAction/styles.module.css";
import classes from "./ButtonLink.module.css";

interface Props extends React.HTMLAttributes<HTMLAnchorElement> {
  path: string;
  text: string;
  external?: boolean;
  className?: string;
}

export const ButtonLink = ({
  path,
  text,
  external = false,
  className = "",
  ...props
}: Props) => {
  return external ? (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} ${styles["button-action"]} ${classes.ButtonLink}`}
      href={path}
    >
      {text}
    </a>
  ) : (
    <a
      {...props}
      className={`${className} ${styles["button-action"]}`}
      href={path}
    >
      {text}
    </a>
  );
};
