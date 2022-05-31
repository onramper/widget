import { TokenInfo } from "layer2";
import { HTMLProps } from "react";

export interface SwapDetailsBarProps extends HTMLProps<HTMLDivElement> {
  className?: string;
  fiatSymbol: string;
  amountIn: number;
  amountOut: number;
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
}
