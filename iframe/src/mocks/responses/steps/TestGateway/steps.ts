import { BASE_API } from "../../../constants";
import possibleFormFieldsStep from "./possibleFomStepFields";
import paymentReviewStep from "./stepPaymentReview";

const personalInfoStep = {
  type: "form",
  progress: 40,
  url: `${BASE_API}/GoTo/TestGateway/emailVerificationStep/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`,
  title: "Your details",
  useHeading: true,
  data: [
    {
      type: "string",
      name: "fullname",
      humanName: "Full name",
      placeholder: "e.g JohnDoe",
    },
    {
      type: "integer",
      name: "phoneCountryCode",
      humanName: "Phone country code",
    },
    {
      type: "integer",
      name: "phoneNumber",
      humanName: "Phone number",
    },
  ],
};

const emailVerificationStep = {
  type: "emailVerification",
  title: "Get onboard with us!",
  url: `${BASE_API}/GoTo/TestGateway/possibleFormFieldsStep/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`,
  description:
    "Hi Thijs! We are going to create an account for you with Onramper for easy trading. ",
  progress: 40,
  data: {
    humanName: "Enter your email address",
    name: "email",
    initialValue: "john.123@mail.com",
    placeholder: "e.g john.123@mail.com",
  },
};

const orderComplete = {
  type: "orderComplete",
  title: "We've successfully received your order",
  description: `We have emailed confirmation link about your order to thijs@onramper.com. Your order is being processed and it may take up to 1-3 working days.`,
};

const transactionOverview = {
  type: "transactionOverview",
  progress: 0,
  url: `${BASE_API}/GoTo/TestGateway/willsee/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`,
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
    feeBreakdown: [
      [
        {
          label: "Expected Output",
          value: "0.000054 BTC",
          strong: true,
        },
        {
          label: "Price Impact",
          value: "0.00%",
          strong: true,
          hint: "Price impact gives you an idea what slippage to actually expect based on the size of the order you're placing and what's going on in the market.",
        },
      ],
      [
        {
          label: "Minimum recieved after slippage ",
          subLabel: "(25.00 %)",
          value: "2.602 DAI",
        },
        {
          label: "Network Fee",
          value: "~$45.67",
        },
      ],
    ],
    walletsData: {
      wallets: [
        {
          walletAddress: "9b2475c48b4111eca8a30242ac12000",
          accountName: "MetaMask Wallet",
          icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGQ9Ik0xNy4yMDcgMi4yMjg1MkwxMC45NjA5IDYuODY3NTZMMTIuMTE2IDQuMTMwNTlMMTcuMjA3IDIuMjI4NTJaIiBmaWxsPSIjRTI3NjFCIiBzdHJva2U9IiNFMjc2MUIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTIuNzg5MDYgMi4yMjg1Mkw4Ljk4NDkyIDYuOTExNUw3Ljg4NjM2IDQuMTMwNTlMMi43ODkwNiAyLjIyODUyWiIgZmlsbD0iI0U0NzYxQiIgc3Ryb2tlPSIjRTQ3NjFCIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0xNC45NjA0IDEyLjk4MTlMMTMuMjk2OSAxNS41MzA2TDE2Ljg1NjIgMTYuNTA5OUwxNy44Nzk0IDEzLjAzODRMMTQuOTYwNCAxMi45ODE5WiIgZmlsbD0iI0U0NzYxQiIgc3Ryb2tlPSIjRTQ3NjFCIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0yLjEyODkxIDEzLjAzODRMMy4xNDU4NiAxNi41MDk5TDYuNzA1MTggMTUuNTMwNkw1LjA0MTY1IDEyLjk4MTlMMi4xMjg5MSAxMy4wMzg0WiIgZmlsbD0iI0U0NzYxQiIgc3Ryb2tlPSIjRTQ3NjFCIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik02LjUwMzU2IDguNjc1NTNMNS41MTE3MiAxMC4xNzU4TDkuMDQ1OTMgMTAuMzMyOEw4LjkyMDM4IDYuNTM0OTFMNi41MDM1NiA4LjY3NTUzWiIgZmlsbD0iI0U0NzYxQiIgc3Ryb2tlPSIjRTQ3NjFCIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0xMy40OTA4IDguNjc1NTJMMTEuMDQyNSA2LjQ5MDk3TDEwLjk2MDkgMTAuMzMyOEwxNC40ODg5IDEwLjE3NThMMTMuNDkwOCA4LjY3NTUyWiIgZmlsbD0iI0U0NzYxQiIgc3Ryb2tlPSIjRTQ3NjFCIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik02LjcwNzAzIDE1LjUzMDVMOC44Mjg4MSAxNC40OTQ3TDYuOTk1NzkgMTMuMDYzNUw2LjcwNzAzIDE1LjUzMDVaIiBmaWxsPSIjRTQ3NjFCIiBzdHJva2U9IiNFNDc2MUIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTExLjE2OCAxNC40OTQ3TDEzLjI5NiAxNS41MzA1TDEzLjAwMSAxMy4wNjM1TDExLjE2OCAxNC40OTQ3WiIgZmlsbD0iI0U0NzYxQiIgc3Ryb2tlPSIjRTQ3NjFCIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0xMy4yOTIxIDE1LjUzMDdMMTEuMTY0MSAxNC40OTQ5TDExLjMzMzYgMTUuODgyMkwxMS4zMTQ3IDE2LjQ2NkwxMy4yOTIxIDE1LjUzMDdaIiBmaWxsPSIjRDdDMUIzIiBzdHJva2U9IiNEN0MxQjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTYuNzAzMTIgMTUuNTMwN0w4LjY4MDUzIDE2LjQ2Nkw4LjY2Nzk3IDE1Ljg4MjJMOC44MjQ5MSAxNC40OTQ5TDYuNzAzMTIgMTUuNTMwN1oiIGZpbGw9IiNEN0MxQjMiIHN0cm9rZT0iI0Q3QzFCMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNOC43MTU1NiAxMi4xNDY3TDYuOTQ1MzEgMTEuNjI1N0w4LjE5NDUzIDExLjA1NDRMOC43MTU1NiAxMi4xNDY3WiIgZmlsbD0iIzIzMzQ0NyIgc3Ryb2tlPSIjMjMzNDQ3IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0xMS4yODEyIDEyLjE0NjdMMTEuODAyMyAxMS4wNTQ0TDEzLjA1NzggMTEuNjI1N0wxMS4yODEyIDEyLjE0NjdaIiBmaWxsPSIjMjMzNDQ3IiBzdHJva2U9IiMyMzM0NDciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTYuNzA2NDkgMTUuNTMwNkw3LjAwNzgxIDEyLjk4MTlMNS4wNDI5NyAxMy4wMzg0TDYuNzA2NDkgMTUuNTMwNloiIGZpbGw9IiNDRDYxMTYiIHN0cm9rZT0iI0NENjExNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNMTIuOTk2MSAxMi45ODE5TDEzLjI5NzQgMTUuNTMwNkwxNC45NjA5IDEzLjAzODRMMTIuOTk2MSAxMi45ODE5WiIgZmlsbD0iI0NENjExNiIgc3Ryb2tlPSIjQ0Q2MTE2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0xNC40ODg5IDEwLjE3NThMMTAuOTYwOSAxMC4zMzI3TDExLjI4NzQgMTIuMTQ2OUwxMS44MDg0IDExLjA1NDZMMTMuMDYzOSAxMS42MjU5TDE0LjQ4ODkgMTAuMTc1OFoiIGZpbGw9IiNDRDYxMTYiIHN0cm9rZT0iI0NENjExNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNNi45NDY4OSAxMS42MjU5TDguMjAyMzggMTEuMDU0Nkw4LjcxNzEzIDEyLjE0NjlMOS4wNDk4NCAxMC4zMzI3TDUuNTE1NjIgMTAuMTc1OEw2Ljk0Njg5IDExLjYyNTlaIiBmaWxsPSIjQ0Q2MTE2IiBzdHJva2U9IiNDRDYxMTYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTUuNTExNzIgMTAuMTc1OEw2Ljk5MzIgMTMuMDYzNEw2Ljk0Mjk4IDExLjYyNTlMNS41MTE3MiAxMC4xNzU4WiIgZmlsbD0iI0U0NzUxRiIgc3Ryb2tlPSIjRTQ3NTFGIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0xMy4wNjI4IDExLjYyNTlMMTMgMTMuMDYzNEwxNC40ODc4IDEwLjE3NThMMTMuMDYyOCAxMS42MjU5WiIgZmlsbD0iI0U0NzUxRiIgc3Ryb2tlPSIjRTQ3NTFGIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik05LjA0NzU1IDEwLjMzMjVMOC43MTQ4NCAxMi4xNDY3TDkuMTI5MTYgMTQuMjg3M0w5LjIyMzMyIDExLjQ2ODdMOS4wNDc1NSAxMC4zMzI1WiIgZmlsbD0iI0U0NzUxRiIgc3Ryb2tlPSIjRTQ3NTFGIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0xMC45NjI1IDEwLjMzMjVMMTAuNzkzIDExLjQ2MjVMMTAuODY4MyAxNC4yODczTDExLjI4ODkgMTIuMTQ2N0wxMC45NjI1IDEwLjMzMjVaIiBmaWxsPSIjRTQ3NTFGIiBzdHJva2U9IiNFNDc1MUYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTExLjI4NzggMTIuMTQ2OEwxMC44NjcyIDE0LjI4NzRMMTEuMTY4NSAxNC40OTQ1TDEzLjAwMTUgMTMuMDYzM0wxMy4wNjQzIDExLjYyNTdMMTEuMjg3OCAxMi4xNDY4WiIgZmlsbD0iI0Y2ODUxQiIgc3Ryb2tlPSIjRjY4NTFCIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik02Ljk0NTMxIDExLjYyNTdMNi45OTU1MyAxMy4wNjMzTDguODI4NTUgMTQuNDk0NUw5LjEyOTg3IDE0LjI4NzRMOC43MTU1NiAxMi4xNDY4TDYuOTQ1MzEgMTEuNjI1N1oiIGZpbGw9IiNGNjg1MUIiIHN0cm9rZT0iI0Y2ODUxQiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNMTEuMzE3MSAxNi40NjU2TDExLjMzNTkgMTUuODgxOEwxMS4xNzkgMTUuNzQzN0g4LjgxMjM1TDguNjY3OTcgMTUuODgxOEw4LjY4MDUzIDE2LjQ2NTZMNi43MDMxMiAxNS41MzAzTDcuMzkzNjUgMTYuMDk1Mkw4Ljc5MzUyIDE3LjA2ODNIMTEuMTk3OEwxMi42MDM5IDE2LjA5NTJMMTMuMjk0NSAxNS41MzAzTDExLjMxNzEgMTYuNDY1NloiIGZpbGw9IiNDMEFEOUUiIHN0cm9rZT0iI0MwQUQ5RSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNMTEuMTY2NCAxNC40OTQ1TDEwLjg2NTEgMTQuMjg3NEg5LjEyNjIyTDguODI0OTEgMTQuNDk0NUw4LjY2Nzk3IDE1Ljg4MThMOC44MTIzNSAxNS43NDM3SDExLjE3OUwxMS4zMzU5IDE1Ljg4MThMMTEuMTY2NCAxNC40OTQ1WiIgZmlsbD0iIzE2MTYxNiIgc3Ryb2tlPSIjMTYxNjE2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0xNy40NzA1IDcuMTY4ODhMMTguMDA0MSA0LjYwNzY3TDE3LjIwNjkgMi4yMjg1MkwxMS4xNjggNi43MTA2MkwxMy40OTA2IDguNjc1NDdMMTYuNzczNyA5LjYzNTkyTDE3LjUwMTkgOC43ODg0NkwxNy4xODgxIDguNTYyNDdMMTcuNjkwMyA4LjEwNDIyTDE3LjMwMTEgNy44MDI5TDE3LjgwMzMgNy40MTk5OEwxNy40NzA1IDcuMTY4ODhaIiBmaWxsPSIjNzYzRDE2IiBzdHJva2U9IiM3NjNEMTYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTEuOTk2MDkgNC42MDc2N0wyLjUyOTY4IDcuMTY4ODhMMi4xOTA3IDcuNDE5OThMMi42OTI4OSA3LjgwMjlMMi4zMDk5NyA4LjEwNDIyTDIuODEyMTYgOC41NjI0N0wyLjQ5ODI5IDguNzg4NDZMMy4yMjAyIDkuNjM1OTJMNi41MDMzMSA4LjY3NTQ3TDguODI1OTggNi43MTA2MkwyLjc4NzA1IDIuMjI4NTJMMS45OTYwOSA0LjYwNzY3WiIgZmlsbD0iIzc2M0QxNiIgc3Ryb2tlPSIjNzYzRDE2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0xNi43NzI4IDkuNjM1OTlMMTMuNDg5NiA4LjY3NTU0TDE0LjQ4NzggMTAuMTc1OUwxMyAxMy4wNjM1TDE0Ljk1ODYgMTMuMDM4NEgxNy44Nzc2TDE2Ljc3MjggOS42MzU5OVoiIGZpbGw9IiNGNjg1MUIiIHN0cm9rZT0iI0Y2ODUxQiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNNi41MDQzIDguNjc1NTRMMy4yMjExOCA5LjYzNTk5TDIuMTI4OTEgMTMuMDM4NEg1LjA0MTY1TDYuOTkzOTQgMTMuMDYzNUw1LjUxMjQ2IDEwLjE3NTlMNi41MDQzIDguNjc1NTRaIiBmaWxsPSIjRjY4NTFCIiBzdHJva2U9IiNGNjg1MUIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTEwLjk1ODggMTAuMzMyN0wxMS4xNjU5IDYuNzEwNjVMMTIuMTIwMSA0LjEzMDYySDcuODgyODFMOC44MjQ0MyA2LjcxMDY1TDkuMDQ0MTQgMTAuMzMyN0w5LjExOTQ3IDExLjQ3NTJMOS4xMjU3NSAxNC4yODc1SDEwLjg2NDZMMTAuODc3MiAxMS40NzUyTDEwLjk1ODggMTAuMzMyN1oiIGZpbGw9IiNGNjg1MUIiIHN0cm9rZT0iI0Y2ODUxQiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8L3N2Zz4NCg==",
          id: "metamask",
          balance: 0.21,
          isConnected: true,
        },
        {
          walletAddress: "9b247eb68b4111eca8a30242ac12000",
          accountName: "Account 1",
          id: "account1",
          balance: 0.0061,
        },
      ],
      selectedWalletId: "metamask",
    },
  },
};

const nextStep: { [key: string]: any } = {
  firstStep: paymentReviewStep,
  personalInfoStep,
  emailVerificationStep,
  possibleFormFieldsStep,
  orderComplete,
  transactionOverview
};

const getNextStep = (currentStep: string) => {
  return nextStep?.[currentStep] || possibleFormFieldsStep;
};

export default {
  getNextStep,
};
