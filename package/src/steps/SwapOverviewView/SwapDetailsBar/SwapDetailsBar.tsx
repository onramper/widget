import { ReactComponent as SwapArrows } from "../../../icons/arrow-swap-horizontal.svg";
import React from "react";
import classes from "./SwapDetailsBar.module.css";
import uriToHttp from "../../../utils";
import { SwapDetailsBarProps } from "./SwapDetailsBar.models";

const SwapDetailsBar = ({
  className = "",
  tokenIn,
  tokenOut,
  estimate,
}: SwapDetailsBarProps) => {
  // TODO: fallback logo icons
  const tokenInURL = uriToHttp(tokenIn.logoURI as string)[0];
  const tokenOutURL = uriToHttp(tokenOut.logoURI as string)[0];

  // TODO: price oracle ??
  const getFiatConversion = () => {
    return "$200";
  };

  return (
    <div className={`${className} ${classes.SwapDetailsBar}`}>
      <div className={`${classes.column} ${classes.left}`}>
        {tokenIn.logoURI && (
          <img
            className={classes.tokenIcon}
            src={tokenInURL}
            alt={tokenIn.name}
          />
        )}
        <div className={classes.textContainer}>
          <div className={classes.description}>You spend</div>
          <div className={classes.amount}>
            {Number(estimate.amountDecimals).toFixed(5)}
          </div>
          <div className={classes.conversion}>({getFiatConversion()})</div>
        </div>
      </div>
      <SwapArrows className={classes.swapIcon} />
      <div className={`${classes.column} ${classes.right}`}>
        {tokenOut.logoURI && (
          <img
            className={classes.tokenIcon}
            src={tokenOutURL}
            alt={tokenOut.name}
          />
        )}
        <div className={classes.textContainer}>
          <div className={classes.description}>You receive</div>
          <div className={classes.amount}>
            {Number(estimate.quoteGasAdjustedDecimals).toFixed(5)}
          </div>
          <div className={classes.conversion}>({getFiatConversion()})</div>
        </div>
      </div>
    </div>
  );
};

export default SwapDetailsBar;
