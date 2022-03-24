import React, { useState } from "react";
import classes from "./styles.module.css";

interface Props extends React.ComponentProps<"img"> {
  className?: string;
  fallbackSrc?: string;
  FallbackComponent?: React.FunctionComponent | SvgrComponent;
  src: string;
}

export const ImageWithFallback = ({
  className,
  src,
  fallbackSrc,
  FallbackComponent,
  ...rest
}: Props) => {
  const [error, setError] = useState(false);

  return error && FallbackComponent ? (
    <FallbackComponent className={`${classes.fallbackIcon} ${className}`} />
  ) : (
    <img
      className={className}
      src={src}
      {...rest}
      onError={(e) => {
        if (fallbackSrc) {
          e.currentTarget.src = fallbackSrc;
        } else {
          setError(true);
        }
        e.currentTarget.onerror = null;
      }}
    />
  );
};
