import { ReactComponent as SwapArrows } from "../../../icons/arrow-swap-horizontal.svg";
import React from "react";
import classes from "./SwapDetailsBar.module.css";
import uriToHttp from "../../../utils";
import { SwapDetailsBarProps } from "./SwapDetailsBar.models";
import { ImageWithFallback } from "../../../common/ImageWithFallback/ImageWithFallback";
import { ReactComponent as Fallback } from "../../../icons/fallback_token_icon.svg";

const SwapDetailsBar = ({
  className = "",
  tokenIn,
  tokenOut,
  estimate,
  conversionIn,
  conversionOut,
}: SwapDetailsBarProps) => {
  // TODO: fallback logo icons
  const tokenInURL = uriToHttp(tokenIn.logoURI as string)[0];
  const tokenOutURL = uriToHttp(tokenOut.logoURI as string)[0];

  return (
    <div className={`${className} ${classes.SwapDetailsBar}`}>
      <div className={`${classes.column} ${classes.left}`}>
        {tokenIn.logoURI && (
          <ImageWithFallback
            className={classes.tokenIcon}
            src={tokenInURL}
            alt={tokenIn?.name ?? "token to sell"}
            FallbackComponent={Fallback}
          />
        )}
        <div className={classes.textContainer}>
          <div className={classes.description}>You spend</div>
          <div className={classes.amount}>
            {Number(estimate.amountDecimals).toFixed(5)}
          </div>
          <div className={classes.conversion}>({conversionIn})</div>
        </div>
      </div>
      <SwapArrows className={classes.swapIcon} />
      <div className={`${classes.column} ${classes.right}`}>
        {tokenOut.logoURI && (
          <ImageWithFallback
            className={classes.tokenIcon}
            src={tokenOutURL}
            alt={tokenOut.name ?? "token to purchase"}
            FallbackComponent={Fallback}
          />
        )}
        <div className={classes.textContainer}>
          <div className={classes.description}>You receive</div>
          <div className={classes.amount}>
            {Number(estimate.quoteGasAdjustedDecimals).toFixed(5)}
          </div>
          <div className={classes.conversion}>({conversionOut})</div>
        </div>
      </div>
    </div>
  );
};

export default SwapDetailsBar;
