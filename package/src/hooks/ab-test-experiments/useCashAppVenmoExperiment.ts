import { useEffect, useState } from "react";

export const useCashAppVenmoExperiment = () => {
  const [variant, setVariant] = useState<VariantType>();

  useEffect(() => {
    if (Math.floor(Math.random() * 2) === 0) {
      //normal approach
      setVariant("Control");
    } else if (Math.floor(Math.random() * 2) === 1) {
      //cash app
      setVariant("CashApp");
    } else {
      //venmo
      setVariant("Venmo");
    }
  }, []);

  return variant;
};

type VariantType = "Control" | "CashApp" | "Venmo";
