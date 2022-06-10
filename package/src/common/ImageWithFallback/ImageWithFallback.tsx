import React from "react";
import classes from "./styles.module.css";

interface Props extends React.ComponentProps<"img"> {
  className?: string;
  fallbackSrc?: string;
  src: string | undefined;
}

export const ImageWithFallback = ({
  className,
  src,
  fallbackSrc,
  ...rest
}: Props) => {
  return (
    <img
      className={`${className} ${classes.fallbackIconColor}`}
      src={src}
      {...rest}
      onError={(e) => {
        if (fallbackSrc) {
          e.currentTarget.src = fallbackSrc;
          e.currentTarget.onerror = null;
        }
      }}
    />
  );
};
