import { QuoteDetails, TokenInfo } from "layer2";
import { HTMLProps } from "react";

export interface SwapDetailsBarProps extends HTMLProps<HTMLDivElement> {
  className?: string;
  estimate: QuoteDetails;
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  conversion: string;
}
