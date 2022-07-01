import { formatUnits } from "ethers/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { formatTokenAmount } from "../../utils";
import { useTransactionContext } from "./useTransactionContext";

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

interface Breakdown {
  inAmount: {
    label: string;
    amount: string;
  };
  totalGas: {
    label: string;
    amount: string;
  };
  fees?: {
    label: string;
    amount: string;
  }[];
  minimumOutput: {
    label: string;
    amount: string;
  };
}
export const useFeeBreakdown = () => {
  const { quote, tokenIn, tokenOut } = useTransactionContext();
  const { feeCosts, gasCosts } = quote ?? defaultValues;

  const [breakdown, setBreakdown] = useState<Breakdown>({
    inAmount: {
      label: "Spend:",
      amount: "0.00",
    },
    totalGas: {
      label: "Estimated gas fee:",
      amount: "0.00",
    },
    minimumOutput: {
      label: "Minimum received:",
      amount: "0.00",
    },
  });

  const calculateFees = useCallback(() => {
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

    const feeCostsArray =
      feeCosts &&
      feeCosts?.map((fee) => {
        return {
          label: fee.name,
          amount: formatTokenAmount(fee.token, fee.amount),
        };
      });

    setBreakdown({
      inAmount: {
        label: "Spend:",
        amount: formattedInAmount ?? "0.00",
      },
      totalGas: {
        label: "Estimated gas fee:",
        amount: totalGasCost ?? "0.00",
      },
      fees: feeCostsArray,
      minimumOutput: {
        label: "Minimum received:",
        amount: formattedOutputAmountAfterFees ?? "0.00",
      },
    });
  }, [feeCosts, gasCosts, quote, tokenIn, tokenOut]);

  useEffect(() => {
    if (quote) {
      calculateFees();
    }
  }, [calculateFees, quote]);

  return breakdown;
};
