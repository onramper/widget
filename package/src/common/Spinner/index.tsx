import classes from "./Spinner.module.css";
import React from "react";

interface SpinnerProps {
  className?: string;
}

const Spinner = ({ className = "" }: SpinnerProps) => {
  return (
    <svg className={`${className} ${classes.Spinner}`} viewBox="0 0 50 50">
      <circle
        className={classes.path}
        stroke="currentColor"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
      ></circle>
    </svg>
  );
};

export default Spinner;
