import { QuoteDetails } from "layer2";
import { useEffect, useState } from "react";

export const usePriceImpact = (quote: QuoteDetails) => {
  const [priceImpact, setPriceImpact] = useState(0);
  
  useEffect(() => {
      setPriceImpact(priceImpact => priceImpact+1)
  }, [quote])

  return priceImpact;
};
