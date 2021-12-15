import React from "react";
import { InputProps } from "./Input.models";
import classes from "./Input.module.css";

const Input: React.FC<InputProps> = (props) => {
    return (
      <div className={classes["wrapper"]}>
          {/* input */}
          {/* error message */}
      </div>
    );
  };

export default Input;