import { useEffect, useState } from "react";

export const usePreSelectItezExperiment = () => {
  const [variant, setVariant] = useState<VariantType>();

  useEffect(() => {
    if (Math.floor(Math.random() * 2) === 0) {
      setVariant("Control");
    } else {
      setVariant("Itez");
    }
  }, []);

  return variant;
};

type VariantType = "Control" | "Itez";
