import React from "react";
import { FeeBreakdownProps } from "./FeeBreakdown.models";
import classes from "./FeeBreakdown.module.css";

const defaultValues = {
  amountDecimals: "0.0000",
  gasUseEstimate: "00000",
  gasUseEstimateUSD: "00000",
  quoteGasAdjustedDecimals: "00000",
};

const FeeBreakdown = ({ quote }: FeeBreakdownProps) => {
  const {
    amountDecimals,
    gasUseEstimate,
    gasUseEstimateUSD,
    quoteGasAdjustedDecimals,
  } = quote ?? defaultValues;

  return (
    <menu className={classes.FeeBreakdown}>
      {amountDecimals && (
        <div className={classes.row}>
          <div className={classes.label}>Spend:</div>
          <div className={classes.amount}>
            {Number(amountDecimals).toFixed(5)}
          </div>
        </div>
      )}
      {gasUseEstimate && (
        <div className={classes.row}>
          <div className={classes.label}>Est. gas fee:</div>
          <div className={classes.amount}>{`${gasUseEstimate} gwei`}</div>
        </div>
      )}
      {gasUseEstimateUSD && (
        <div className={classes.row}>
          <div className={classes.amount}>{`($13.5)`}</div>
        </div>
      )}
      <hr className={classes.divider} />
      <div className={classes.row}>
        <div className={classes.label}>Total received:</div>
        <div className={classes.amount}>
          {Number(quoteGasAdjustedDecimals).toFixed(6)}
        </div>
      </div>
    </menu>
  );
};
export default FeeBreakdown;
