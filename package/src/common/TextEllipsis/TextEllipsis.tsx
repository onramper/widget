import React, { useEffect, useRef, useState } from "react";
import classes from "./TextEllipsis.module.css";

const TextEllipsis: React.FC<{ text: string; className?: string }> = (
  props
) => {
  const [values, setValues] = useState<string[]>([props.text]);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValues([props.text]);
  }, [props.text]);

  useEffect(() => {
    if (!nodeRef.current || values.length === 2) return;

    const originalTxt = values[0];
    const scrollWidth = nodeRef.current?.scrollWidth;
    const clientWidth = nodeRef.current?.clientWidth;
    if (scrollWidth > clientWidth) {
      setValues([
        originalTxt.slice(0, originalTxt.length - 3),
        originalTxt.slice(originalTxt.length - 3, originalTxt.length),
      ]);
    }
  }, [values]);

  return (
    <div className={`${classes["wrapper"]} ${props.className || ""}`}>
      <div className={classes["main-text"]} ref={nodeRef}>
        {values[0]}
      </div>
      {values.length > 1 && (
        <div className={classes["suffix"]}>{values[1]}</div>
      )}
    </div>
  );
};

export default TextEllipsis;
