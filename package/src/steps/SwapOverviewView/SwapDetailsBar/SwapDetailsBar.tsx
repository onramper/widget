import { ReactComponent as SwapArrows } from "../../../icons/arrow-swap-horizontal.svg";
import React from "react";
import classes from "./SwapDetailsBar.module.css";
import uriToHttp from "../../../utils";
import { SwapDetailsBarProps } from "./SwapDetailsBar.models";
import { ImageWithFallback } from "../../../common/ImageWithFallback/ImageWithFallback";
import { ReactComponent as Fallback } from "../../../icons/fallback_token_icon.svg";

const SwapDetailsBar = (props: SwapDetailsBarProps) => {
  const {
    className = "",
    fiatSymbol = "$",
    amountIn = 200,
    amountOut = 0.0055,
    tokenIn,
    tokenOut,
  } = props;
  const tokenInURL = tokenIn?.logoURI ? uriToHttp(tokenIn.logoURI)[0] : "";
  const tokenOutURL = tokenOut?.logoURI ? uriToHttp(tokenOut?.logoURI)[0] : "";

  return (
    <div className={`${className} ${classes.SwapDetailsBar}`}>
      <div className={`${classes.column} ${classes.left}`}>
        <ImageWithFallback
          className={classes.tokenIcon}
          src={tokenInURL}
          alt={tokenIn?.name ?? "token to sell"}
          FallbackComponent={Fallback}
        />

        <div className={classes.textContainer}>
          <div className={classes.description}>You spend</div>
          <div className={classes.amount}>{amountIn.toFixed(5)}</div>
          <div className={classes.conversion}>({fiatSymbol})</div>
        </div>
      </div>
      <SwapArrows className={classes.swapIcon} />
      <div className={`${classes.column} ${classes.right}`}>
        <ImageWithFallback
          className={classes.tokenIcon}
          src={tokenOutURL ?? ""}
          alt={tokenOut.name ?? "token to purchase"}
          FallbackComponent={Fallback}
        />
        <div className={classes.textContainer}>
          <div className={classes.description}>You receive</div>
          <div className={classes.amount}>{amountOut.toFixed(5)}</div>
          <div className={classes.conversion}>({fiatSymbol})</div>
        </div>
      </div>
    </div>
  );
};

export default SwapDetailsBar;
