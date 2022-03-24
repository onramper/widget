import React, { useState } from "react";
import { ReactComponent as Fallback } from "../../icons/fallback_token_icon.svg";
import classes from "./styles.module.css";

interface Props extends React.ComponentProps<"img"> {
  className?: string;
  src: string;
}

export const ImageWithFallback = ({ className, src, ...rest }: Props) => {
  const [error, setError] = useState(false);

  return error ? (
    <Fallback className={`${classes.fallbackIcon} ${className}`} />
  ) : (
    <img
      className={className}
      src={src}
      {...rest}
      onError={(e) => {
        e.currentTarget.onerror = null;
        setError(true);
      }}
    />
  );
};
