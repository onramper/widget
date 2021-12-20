import React from "react";
import DropdownHandle from "../DropdownHandle";
import { DropdownHandleProps } from "../DropdownHandle.models";
import classes from "../DropdownHandle.module.css";

const FormDropdownHandle: React.FC<DropdownHandleProps> = (props) => (
  <DropdownHandle {...props} className={classes["form-dropdown-wrapper"]} />
);

export default FormDropdownHandle;