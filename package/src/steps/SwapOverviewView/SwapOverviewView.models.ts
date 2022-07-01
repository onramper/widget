import {
  StepType,
  SwapOverviewViewStep,
} from "../../ApiContext/api/types/nextStep";

export type SwapOverviewViewProps = {
  nextStep: SwapOverviewViewStep;
};

// https://li.quest/v1/tokens?chains=ETH => mainnet token list
// https://staging.li.quest/v1/tokens?chains=ROP ==> testnet tokens

export const startPropsTestnet: SwapOverviewViewProps = {
  nextStep: {
    type: StepType.swapOverview,
    customerGateway: "Moonpay_Lifi",
    progress: 80,
    amountIn: 0.0002,
    amountOut: 0,
    tokenIn: {
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      symbol: "ETH",
      chainId: 3,
      name: "ETH",
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    },
    tokenOut: {
      address: "0x31f42841c2db5173425b5223809cf3a38fede360",
      decimals: 18,
      symbol: "DAI",
      chainId: 3,
      name: "DAI",
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
    },
    fiatSymbol: "$",
    userId: "123",
    txId: "hZoCHgQdR58_7_51kc3f6w--",
  },
};

export const startPropsMainnet: SwapOverviewViewProps = {
  nextStep: {
    type: StepType.swapOverview,
    customerGateway: "Moonpay_Lifi",
    progress: 80,
    amountIn: 0.0002,
    amountOut: 0,
    tokenIn: {
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      symbol: "ETH",
      chainId: 1,
      name: "ETH",
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    },
    tokenOut: {
      address: "0x6b175474e89094c44da98b954eedeac495271d0f",
      symbol: "DAI",
      decimals: 18,
      chainId: 1,
      name: "DAI",
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
    },
    fiatSymbol: "$",
    userId: "123",
    txId: "testTxId",
  },
};

export const startProps: SwapOverviewViewProps = {
  nextStep: {
    type: StepType.swapOverview,
    customerGateway: "Moonpay_Lifi",
    progress: 80,
    amountIn: 0.005,
    amountOut: 0,
    tokenIn: {
      name: "Wrapped Ether",
      address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
      symbol: "WETH",
      decimals: 18,
      chainId: 3,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    },
    tokenOut: {
      name: "Onramper Test Token",
      symbol: "OTT",
      address: "0xBe8AFb431f18C126a69B79E87cA3016936D7060C",
      logoURI:
        "https://pbs.twimg.com/profile_images/1309065154856980480/dXJItCo4_400x400.jpg",
      chainId: 3,
      decimals: 18,
    },
    fiatSymbol: "$",
    userId: "",
    txId: "Arf4m7ZCTeH7nM9v8KFXmg--",
  },
};

const testnetResponse = {
  id: "9a4aae3e-5eec-4083-b863-0b4e9ce0fa00",
  type: "swap",
  tool: "0x",
  toolDetails: {
    key: "0x",
    name: "0x",
    logoURI:
      "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/zerox.png",
  },
  action: {
    fromChainId: 3,
    toChainId: 3,
    fromToken: {
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      symbol: "ETH",
      chainId: 3,
      coinKey: "ETH",
      name: "ETH",
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    },
    toToken: {
      address: "0xbe8afb431f18c126a69b79e87ca3016936d7060c",
      symbol: "OTT",
      decimals: 18,
      chainId: 3,
      name: "Onramper Test Token",
      coinKey: "OTT",
      logoURI: "",
    },
    fromAmount: "1000000000000000000",
    slippage: 0.03,
    fromAddress: "0xC54070dA79E7E3e2c95D3a91fe98A42000e65a48",
    toAddress: "0xC54070dA79E7E3e2c95D3a91fe98A42000e65a48",
  },
  estimate: {
    fromAmount: "1000000000000000000",
    toAmount: "1519235363445658771303",
    toAmountMin: "1519235363445658771303",
    approvalAddress: "0x362fA9D0bCa5D19f743Db50738345ce2b40eC99f",
    executionDuration: 30,
    feeCosts: [],
    gasCosts: [
      {
        type: "SEND",
        price: "3000000000",
        estimate: "149757",
        limit: "187196",
        amount: "449271000000000",
        token: {
          address: "0x0000000000000000000000000000000000000000",
          decimals: 18,
          symbol: "ETH",
          chainId: 3,
          coinKey: "ETH",
          name: "ETH",
          logoURI:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        },
      },
    ],
    data: {
      chainId: 3,
      price: "1519.235363445658771303",
      guaranteedPrice: "1473.658302542289008163",
      estimatedPriceImpact: null,
      to: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
      data: "0x415565b0000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000be8afb431f18c126a69b79e87ca3016936d7060c0000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000004fe31e0262ca43762300000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000460000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000040000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c778417e063141139fce010982780140aa0cd5ab000000000000000000000000be8afb431f18c126a69b79e87ca3016936d7060c000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002a00000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000012556e69737761705633000000000000000000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000004fe31e0262ca437623000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000e592427a0aece92de3edee1f18e0157c058615640000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000002bc778417e063141139fce010982780140aa0cd5ab0001f4be8afb431f18c126a69b79e87ca3016936d7060c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c778417e063141139fce010982780140aa0cd5ab000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000000869584cd000000000000000000000000100000000000000000000000000000000000001100000000000000000000000000000000000000000000002dd8ace88662bda77c",
      value: "1000000000000000000",
      gas: "149757",
      estimatedGas: "149757",
      gasPrice: "2000000000",
      protocolFee: "0",
      minimumProtocolFee: "0",
      buyTokenAddress: "0xbe8afb431f18c126a69b79e87ca3016936d7060c",
      sellTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      buyAmount: "1519235363445658771303",
      sellAmount: "1000000000000000000",
      sources: [
        {
          name: "Kyber",
          proportion: "0",
        },
        {
          name: "0x",
          proportion: "0",
        },
        {
          name: "SushiSwap",
          proportion: "0",
        },
        {
          name: "Uniswap",
          proportion: "0",
        },
        {
          name: "Uniswap_V2",
          proportion: "0",
        },
        {
          name: "Uniswap_V3",
          proportion: "1",
        },
        {
          name: "Curve",
          proportion: "0",
        },
        {
          name: "Mooniswap",
          proportion: "0",
        },
      ],
      orders: [
        {
          makerToken: "0xbe8afb431f18c126a69b79e87ca3016936d7060c",
          takerToken: "0xc778417e063141139fce010982780140aa0cd5ab",
          makerAmount: "1519235363445658771303",
          takerAmount: "1000000000000000000",
          fillData: {
            router: "0xe592427a0aece92de3edee1f18e0157c05861564",
            tokenAddressPath: [
              "0xc778417e063141139fce010982780140aa0cd5ab",
              "0xbe8afb431f18c126a69b79e87ca3016936d7060c",
            ],
            uniswapPath:
              "0xc778417e063141139fce010982780140aa0cd5ab0001f4be8afb431f18c126a69b79e87ca3016936d7060c",
            gasUsed: 64757,
          },
          source: "Uniswap_V3",
          sourcePathId:
            "0xcf9680aca2729ca2befd2d85796b657a0f2267d613bc0ac60e849d0a58acfd29",
          type: 0,
        },
      ],
      allowanceTarget: "0x0000000000000000000000000000000000000000",
      sellTokenToEthRate: "1",
      buyTokenToEthRate: "0",
      approvalAddress: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
    },
    fromAmountUSD: "0.00",
    toAmountUSD: "0.00",
  },
  transactionRequest: {
    from: "0xC54070dA79E7E3e2c95D3a91fe98A42000e65a48",
    to: "0x362fA9D0bCa5D19f743Db50738345ce2b40eC99f",
    chainId: 3,
    data: "0xa4baa10c000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001605af9d7929231bc63a4d2d54dbe9a67919fc38b3dd0de136ca415415cf7f3f681000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000be8afb431f18c126a69b79e87ca3016936d7060c000000000000000000000000c54070da79e7e3e2c95d3a91fe98a42000e65a4800000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000be8afb431f18c126a69b79e87ca3016936d7060c0000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000006a8415565b0000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000be8afb431f18c126a69b79e87ca3016936d7060c0000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000004fe31e0262ca43762300000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000460000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000040000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c778417e063141139fce010982780140aa0cd5ab000000000000000000000000be8afb431f18c126a69b79e87ca3016936d7060c000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002a00000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000012556e69737761705633000000000000000000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000004fe31e0262ca437623000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000e592427a0aece92de3edee1f18e0157c058615640000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000002bc778417e063141139fce010982780140aa0cd5ab0001f4be8afb431f18c126a69b79e87ca3016936d7060c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c778417e063141139fce010982780140aa0cd5ab000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000000869584cd00000000000000000000000010000000000000000000000000000000000000110000000000000000000000000000000000000000000000cb5f5e43d162bda77c000000000000000000000000000000000000000000000000",
    value: "0x0de0b6b3a7640000",
    gasPrice: "0x77359400",
    gasLimit: "0x08363a",
  },
};

const mainnetResponse = {
  id: "a2a8f9ca-8243-40a0-96ea-78ccbb98045b",
  type: "swap",
  tool: "1inch",
  toolDetails: {
    key: "1inch",
    name: "1inch",
    logoURI:
      "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/oneinch.png",
  },
  action: {
    fromChainId: 1,
    toChainId: 1,
    fromToken: {
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
    toToken: {
      address: "0x6b175474e89094c44da98b954eedeac495271d0f",
      symbol: "DAI",
      decimals: 18,
      chainId: 1,
      name: "DAI",
      coinKey: "DAI",
      priceUSD: "1",
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
    },
    fromAmount: "1000000000000000000",
    slippage: 0.03,
    fromAddress: "0xC54070dA79E7E3e2c95D3a91fe98A42000e65a48",
    toAddress: "0xC54070dA79E7E3e2c95D3a91fe98A42000e65a48",
  },
  estimate: {
    fromAmount: "1000000000000000000",
    toAmount: "1011058826345187467680",
    toAmountMin: "980727061554831843650",
    approvalAddress: "0x362fA9D0bCa5D19f743Db50738345ce2b40eC99f",
    executionDuration: 30,
    feeCosts: [],
    gasCosts: [
      {
        type: "SEND",
        price: "45000000000",
        estimate: "181416",
        limit: "226770",
        amount: "8163720000000000",
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
    data: {
      fromToken: {
        symbol: "ETH",
        name: "Ethereum",
        decimals: 18,
        address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        logoURI:
          "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png",
        tags: ["native"],
      },
      toToken: {
        symbol: "DAI",
        name: "Dai Stablecoin",
        decimals: 18,
        address: "0x6b175474e89094c44da98b954eedeac495271d0f",
        logoURI:
          "https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png",
        eip2612: true,
        tags: ["tokens"],
      },
      toTokenAmount: "1011058826345187467680",
      fromTokenAmount: "1000000000000000000",
      protocols: [
        [
          [
            {
              name: "DXSWAP",
              part: 100,
              fromTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
              toTokenAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
            },
          ],
        ],
      ],
      estimatedGas: 181416,
      approvalAddress: "0x1111111254fb6c44bac0bed2854e76f90643097d",
    },
    fromAmountUSD: "1001.29",
    toAmountUSD: "1011.06",
  },
  transactionRequest: {
    from: "0xC54070dA79E7E3e2c95D3a91fe98A42000e65a48",
    to: "0x362fA9D0bCa5D19f743Db50738345ce2b40eC99f",
    chainId: 1,
    data: "0xa4baa10c000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001607793e7f77147205af56a0be9c11967ef60e8514b2e3bfa945a0e305d103c4b020000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000c54070da79e7e3e2c95d3a91fe98a42000e65a4800000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000001111111254fb6c44bac0bed2854e76f90643097d0000000000000000000000001111111254fb6c44bac0bed2854e76f90643097d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000006b175474e89094c44da98b954eedeac495271d0f0000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000c82e95b6c800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000352a52725e946861410000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000180000000000000003b74a4607515be43d16f871588adc135d58a9c30a71eb34f2e9b3012000000000000000000000000000000000000000000000000",
    value: "0x0de0b6b3a7640000",
    gasPrice: "0x0bdfc40380",
    gasLimit: "0x068312",
  },
};
