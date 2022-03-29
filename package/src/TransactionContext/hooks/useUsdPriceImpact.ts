import { TokenInfo } from "layer2";
import { useCallback, useEffect, useState } from "react";

const getFiatConversion = async (
  token: TokenInfo,
  amount: number,
  signal?: AbortSignal
) => {
  try {
    const usdAmount = await new Promise<number|undefined>((resolve, reject) => {
      setTimeout(() => {
        // TODO: call endpoint
        if(!signal?.aborted) {
          console.log("Fake converting token: ", token.address)
          resolve(amount * Math.random())
        } else {
          const error = new Error();
          error.name = "AbortError";
          reject(error);
        }
      }, 2000);
    })
    return usdAmount;
  } catch (error) {
    if ((error as Error)?.name !== "AbortError") {
      console.error(error);
    }

    return undefined;
  }
};

const useUsdPrice = (token: TokenInfo, amount: number) => {
  const [tokenPrice, setPrice] = useState<number | undefined>();
  const [, setConversionCall] = useState<AbortController>();

  const getAndUpdateAbortController = useCallback(() => {
    const newController = new AbortController();
    const { signal } = newController;

    setConversionCall((currentController) => {
      currentController?.abort();
      return newController;
    });

    return signal;
  }, []);

  useEffect(() => {
    (async () => {
      setPrice(undefined);

      const signal = getAndUpdateAbortController();
      const usdAmount = await getFiatConversion(
        token,
        amount,
        signal
      );
      if (signal.aborted) {
        return;
      }
      setPrice(usdAmount);
    })();
  }, [amount, getAndUpdateAbortController, token]);

  return tokenPrice;
};

export const useUsdPriceImpact = (
  tokenIn: TokenInfo,
  tokenOut: TokenInfo,
  amountIn: number,
  amountOut: number
) => {
  const tokenInPrice = useUsdPrice(tokenIn, amountIn);
  const tokenOutPrice = useUsdPrice(tokenOut, amountOut);

  if (tokenInPrice === undefined || tokenOutPrice === undefined) {
    return;
  }

  return ((tokenOutPrice - tokenInPrice) / (tokenInPrice * 100)) * 10000;
};
