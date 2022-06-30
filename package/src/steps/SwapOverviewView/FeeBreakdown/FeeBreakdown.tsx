import { formatUnits } from "ethers/lib/utils";
import React from "react";
import { useTransactionContext } from "../../../TransactionContext/hooks";
import { formatTokenAmount, trimLargeNumber } from "../../../utils";
import classes from "./FeeBreakdown.module.css";

// arbitrary values for display purposes while quote loads
const defaultValues = {
  fromAmount: "200000000000000",
  toAmountMin: "980727061554831843650",
  feeCosts: [
    {
      type: "SEND",
      name: "Fees",
      price: "45000000000",
      estimate: "181416",
      limit: "226770",
      amount: "00000000",
      amountUSD: "8.17",
      token: {
        address: "0x0000000000000000000000000000000000000000",
        symbol: "ETH",
        decimals: 18,
        chainId: 1,
        name: "ETH",
        coinKey: "ETH",
        priceUSD: "1001.29",
        logoURI:
          "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
      },
    },
  ],
  gasCosts: [
    {
      type: "SEND",
      price: "1500000000",
      estimate: "500000",
      limit: "537500",
      amount: "00000000",
      amountUSD: "0.00",
      token: {
        address: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        symbol: "ETH",
        chainId: 3,
        name: "ETH",
        logoURI:
          "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
      },
    },
  ],
};

const FeeBreakdown = () => {
  const { quote, inAmount, tokenIn, tokenOut } = useTransactionContext();
  const { feeCosts, gasCosts } = quote ?? defaultValues;

  const formattedInAmount = quote
    ? formatTokenAmount(tokenIn, quote.fromAmount)
    : "0.00";

  const formattedOutputAmountAfterFees = quote
    ? formatTokenAmount(tokenOut, quote.toAmountMin)
    : "0.00";

  const totalGasCost = gasCosts
    ?.map((cost) => formatUnits(cost.amount, "gwei"))
    .reduce((a, b) => Number(a) + Number(b), 0)
    .toString();

  const feeCostsArray = feeCosts?.map((fee) => {
    return {
      name: fee.name,
      feeAmount: formatTokenAmount(fee.token, fee.amount),
    };
  });

  return (
    <menu className={classes.FeeBreakdown}>
      {formattedInAmount && (
        <div className={classes.row}>
          <div className={classes.label}>Spend:</div>
          <div className={classes.amount}>
            {trimLargeNumber(formattedInAmount, 6)}
          </div>
        </div>
      )}
      {totalGasCost && (
        <div className={classes.row}>
          <div className={classes.label}>Est. gas fee:</div>
          <div className={classes.amount}>{`${trimLargeNumber(
            totalGasCost,
            0
          )} gwei`}</div>
        </div>
      )}
      {feeCostsArray?.length &&
        feeCostsArray?.map((fee) => (
          <div key={fee.name} className={classes.row}>
            <div className={classes.label}>{fee.name}</div>
            <div className={classes.amount}>{`${trimLargeNumber(
              fee.feeAmount,
              0
            )} gwei`}</div>
          </div>
        ))}

      <hr className={classes.divider} />
      <div className={classes.row}>
        <div className={classes.label}> Minimum received:</div>
        <div className={classes.amount}>
          {trimLargeNumber(formattedOutputAmountAfterFees, 6)}
        </div>
      </div>
    </menu>
  );
};
export default FeeBreakdown;
