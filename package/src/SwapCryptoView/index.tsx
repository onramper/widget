import PlayGround from "./PlayGround";
import React, { useCallback, useContext, useEffect } from "react";
import { BASE_API, isDemoEnv } from "../ApiContext/api/constants";
import { NavContext } from "../NavContext";
import Step from "../steps/Step";
import { SwapOverviewVewStep } from "../ApiContext/api/types/nextStep";

const SwapCryptoView = () => {
  const { nextScreen } = useContext(NavContext);

  const goToSwapScreen = useCallback(
    async (name = "transactionOverview") => {
      const stepUrl = `${BASE_API}/GoTo/TestGateway/${name}`;
      const swapStep = await (
        await fetch(`${stepUrl}`, { method: "POST" })
      ).json();
      console.log(swapStep);
      nextScreen(<Step nextStep={swapStep} />);
    },
    [nextScreen]
  );

  useEffect(() => {
    if(isDemoEnv) {
      goToSwapScreen();
      return;
    }

    //TODO: always to to goToSwapScreen(); once BE is ready
    const fakeResponse = {
      type: "transactionOverview",
      progress: 0,
      url: "https://staging.onramper.tech/GoTo/TestGateway/willsee/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd",
      data: {
        userData: {
          userAddress: "0xC54070dA79E7E3e2c95D3a91fe98A42000e65a48",
        },
        transactionData: {
          blockNumber: "10185753",
          amount: "20000000000000000",
          amountDecimals: "0.02",
          quote: "8444356312685722",
          quoteDecimals: "0.008444356312685722",
          quoteGasAdjusted: "8234778646453608",
          quoteGasAdjustedDecimals: "0.008234778646453608",
          gasUseEstimateQuote: "209577666232113",
          gasUseEstimateQuoteDecimals: "0.000209577666232113",
          gasUseEstimate: "273000",
          gasUseEstimateUSD: "1233400.142447018182591146",
          gasPriceWei: "2176156056",
          route: [
            [
              {
                type: "v3-pool",
                address: "0xAD24b6AC28bF47A04a72952945E2Ff486C0D6C7A",
                tokenIn: {
                  chainId: 4,
                  decimals: "18",
                  address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
                  symbol: "WETH",
                },
                tokenOut: {
                  chainId: 4,
                  decimals: "18",
                  address: "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
                  symbol: "DAI",
                },
                fee: "10000",
                liquidity: "74621150333471268692845199",
                sqrtRatioX96: "1091922646375080150695468482358301008",
                tickCurrent: "328793",
                amountIn: "20000000000000000",
              },
              {
                type: "v3-pool",
                address: "0x0f04024bdA15F6e5D48Ed92938654a6449F483ed",
                tokenIn: {
                  chainId: 4,
                  decimals: "18",
                  address: "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
                  symbol: "DAI",
                },
                tokenOut: {
                  chainId: 4,
                  decimals: "18",
                  address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
                  symbol: "WETH",
                },
                fee: "3000",
                liquidity: "145105276627563266475856653",
                sqrtRatioX96: "988368932764676303346888568896555093",
                tickCurrent: "326801",
              },
              {
                type: "v3-pool",
                address: "0x188680AF5736b20a852180ED5C217A386270d319",
                tokenIn: {
                  chainId: 4,
                  decimals: "18",
                  address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
                  symbol: "WETH",
                },
                tokenOut: {
                  chainId: 4,
                  decimals: "18",
                  address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
                  symbol: "UNI",
                },
                fee: "500",
                liquidity: "46150409192612477783",
                sqrtRatioX96: "133393118395225234004082131777",
                tickCurrent: "10419",
                amountOut: "8444356312685722",
              },
            ],
          ],
          routeString:
            "[V3] 100.00% = WETH -- 1% --> DAI -- 0.3% --> WETH -- 0.05% --> UNI",
          quoteId: "1b1e8",
        },
        tokenIn: {
          name: "Wrapped Ether",
          address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
          symbol: "WETH",
          decimals: 18,
          chainId: 4,
          logoURI:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        },
        tokenOut: {
          name: "Uniswap",
          address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
          symbol: "UNI",
          decimals: 18,
          chainId: 4,
          logoURI: "ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg",
        },
        fiatSymbol: "$",
        balance: 989.2692,
        deadline: 600,
        slippage: 0.1,
        userId: "13"
      },
    } as SwapOverviewVewStep;
    nextScreen(<Step nextStep={fakeResponse} />);
  }, [goToSwapScreen, nextScreen]);

  return <PlayGround />;
};

export default SwapCryptoView;
