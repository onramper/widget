import React from "react";
import { useFeeBreakdown } from "../../../TransactionContext/hooks/useFeeBreakdown";
import { trimLargeNumber } from "../../../utils";
import classes from "./FeeBreakdown.module.css";

const FeeBreakdown = () => {
  const { inAmount, totalGas, minimumOutput, fees } = useFeeBreakdown();

  return (
    <menu className={classes.FeeBreakdown}>
      {inAmount && (
        <div className={classes.row}>
          <div className={classes.label}>{inAmount.label}</div>
          <div className={classes.amount}>
            {trimLargeNumber(inAmount.amount, 6)}
          </div>
        </div>
      )}
      {totalGas && (
        <div className={classes.row}>
          <div className={classes.label}>{totalGas.label}</div>
          <div className={classes.amount}>{`${trimLargeNumber(
            totalGas.amount,
            0
          )} gwei`}</div>
        </div>
      )}
      {fees &&
        fees?.length > 0 &&
        fees?.map((fee) => (
          <div key={fee.label} className={classes.row}>
            <div className={classes.label}>{fee.label}</div>
            <div className={classes.amount}>{`${trimLargeNumber(
              fee.amount,
              0
            )} gwei`}</div>
          </div>
        ))}

      <hr className={classes.divider} />
      <div className={classes.row}>
        <div className={classes.label}>{minimumOutput.label}</div>
        <div className={classes.amount}>
          {trimLargeNumber(minimumOutput.amount, 6)}
        </div>
      </div>
    </menu>
  );
};
export default FeeBreakdown;
