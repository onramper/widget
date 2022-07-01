import { ReactComponent as SwapArrows } from "../../../icons/arrow-swap-horizontal.svg";
import React from "react";
import classes from "./SwapDetailsBar.module.css";
import uriToHttp from "../../../utils";
import { SwapDetailsBarProps } from "./SwapDetailsBar.models";
import { ImageWithFallback } from "../../../common/ImageWithFallback/ImageWithFallback";
import Fallback from "../../../icons/fallback_token_icon.svg";
import { useTransactionContext } from "../../../TransactionContext/hooks";
import { formatEther } from "ethers/lib/utils";

const SwapDetailsBar = ({ className }: SwapDetailsBarProps) => {
  const { tokenIn, tokenOut, quote } = useTransactionContext();

  const tokenInURL = tokenIn?.logoURI ? uriToHttp(tokenIn.logoURI)[0] : "";
  const tokenOutURL = tokenOut?.logoURI ? uriToHttp(tokenOut?.logoURI)[0] : "";

  const formattedInputAmount = quote
    ? Number(formatEther(quote.fromAmount)).toFixed(5)
    : "0.00";

  const formattedOutputAmount = quote
    ? Number(formatEther(quote.toAmount)).toFixed(5)
    : "0.00";

  return (
    <div className={`${className} ${classes.SwapDetailsBar}`}>
      <div className={`${classes.column} ${classes.left}`}>
        <ImageWithFallback
          className={classes.tokenIcon}
          src={tokenInURL}
          alt={tokenIn?.name ?? "token to sell"}
          fallbackSrc={Fallback}
        />

        <div className={classes.textContainer}>
          <div className={classes.description}>You spend</div>
          <div className={classes.amount}>{formattedInputAmount}</div>
          <div className={classes.conversion}>
            {`($ ${quote?.fromAmountUSD ?? "0.00"})`}
          </div>
        </div>
      </div>
      <SwapArrows className={classes.swapIcon} />
      <div className={`${classes.column} ${classes.right}`}>
        <ImageWithFallback
          className={classes.tokenIcon}
          src={tokenOutURL ?? ""}
          alt={tokenOut.name ?? "token to purchase"}
          fallbackSrc={Fallback}
        />
        <div className={classes.textContainer}>
          <div className={classes.description}>You receive</div>
          <div className={classes.amount}>{formattedOutputAmount}</div>
          <div className={classes.conversion}>
            {" "}
            {`($ ${quote?.toAmountUSD ?? "0.00"})`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapDetailsBar;
