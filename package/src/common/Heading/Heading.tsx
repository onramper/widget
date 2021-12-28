import React from "react";
import classes from "./Heading.module.css";
import commonClasses from "../../styles.module.css";

const Heading: React.FC<{text: string}> = (props) => {
    return (
      <h1 className={`${commonClasses["remove-default"]} ${classes["wrapper"]}`}>
          {props.text}
      </h1>
    );
  };

export default Heading;