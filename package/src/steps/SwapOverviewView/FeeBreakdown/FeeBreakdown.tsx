import React from "react";
import { FeeBreakdownProps } from "./FeeBreakdown.models";
import classes from "./FeeBreakdown.module.css";

const FeeBreakdown = ({ transactionDetails }: FeeBreakdownProps) => {
  const {
    amountDecimals,
    gasUseEstimate,
    gasUseEstimateUSD,
    quoteGasAdjustedDecimals,
  } = transactionDetails;

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
          <div className={classes.label}>Estimated gas fee:</div>
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
