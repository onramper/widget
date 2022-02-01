import React from "react";

export interface Props {
  className?: string;
  name: string;
  connectFunction: () => void;
  activating: boolean;
  active: boolean;
  // Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}

function WalletButton({
  className,
  name,
  connectFunction,
  activating,
  active,
  ...props
}: Props) {
  const handleClick = () => {
    connectFunction && connectFunction();
  };

  const getDescription = () => {
    if (active) {
      return "✅ connected";
    } else if (activating) {
      return "⏳ connecting...";
    } else {
      return `${name} `;
    }
  };

  const description = getDescription();

  return (
    <button {...props} className={`${className}`} onClick={handleClick}>
      <span>{description}</span>
    </button>
  );
}

export default WalletButton;
