import React from "react";
import classes from "./FeeBreakdown.module.css";
import { TransactionEstimate } from "../../../ApiContext/api/types/nextStep";

interface Props {
  transactionDetails: TransactionEstimate;
}

const FeeBreakdown = ({ transactionDetails }: Props) => {
  const { gasFee, swapFee } = transactionDetails;

  const total = Number(gasFee) + Number(swapFee);
  return (
    <menu className={classes.FeeBreakdown}>
      {gasFee && (
        <div className={classes.row}>
          <div className={classes.label}>Estimated gas fee:</div>
          <div className={classes.amount}>{gasFee}</div>
        </div>
      )}
      {swapFee && (
        <div className={classes.row}>
          <div className={classes.label}>Swap fee:</div>
          <div className={classes.amount}>{swapFee}</div>
        </div>
      )}
      <hr className={classes.divider} />
      <div className={classes.row}>
        <div className={classes.label}>Total:</div>
        <div className={classes.amount}>{total.toFixed(6)}</div>
      </div>
      <div className={classes.row}>
        <div className={classes.amount}>{"($126)"}</div>
      </div>
    </menu>
  );
};
export default FeeBreakdown;
