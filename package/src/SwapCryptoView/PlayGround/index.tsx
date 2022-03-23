import {
  useEtherBalance,
  formatEther,
  useLayer2,
  QuoteDetails,
  useSendTransaction,
  TokenList,
  TokenInfo,
  getSwapParams,
  getTokens,
  getQuote,
} from "layer2";
import React, { useState } from "react";
import WalletModal from "../../common/WalletModal/WalletModal";
import styles from "../../styles.module.css";
import { browserSupportsMetamask } from "../../utils";

const PlayGround = () => {
  const { account } = useLayer2();
  const balance = useEtherBalance(account);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [inputAmount, setInputAmount] = useState<string>("");
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [_, setQuote] = useState<QuoteDetails | null>(null);
  const { sendTransaction } = useSendTransaction();
  const [, setTokenList] = useState<TokenList | null>(null);

  const tokenIn: TokenInfo = {
    name: "Wrapped Ether",
    address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
    symbol: "WETH",
    decimals: 18,
    chainId: 4,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc778417E063141139Fce010982780140Aa0cD5Ab/logo.png",
  };

  const tokenOut: TokenInfo = {
    name: "Dai Stablecoin",
    address: "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
    symbol: "DAI",
    decimals: 18,
    chainId: 4,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735/logo.png",
  };

  const handleGetTokens = async () => {
    if (!browserSupportsMetamask()) {
      return;
    }
    try {
      const list = await getTokens();
      if (list) {
        setTokenList(list);
      }
    } catch (error) {
      alert("unable to fetch token! 😭");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.currentTarget.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAmount(e.currentTarget.value);
  };

  const handleSwap = async () => {
    if (account && balance) {
      console.table({
        Balance: Number(formatEther(balance)),
        InputAmount: Number(inputAmount),
      });
      try {
        setLoadingMessage("fetching swap data...");
        const res = await getSwapParams(
          Number(formatEther(balance)),
          tokenIn,
          tokenOut,
          Number(inputAmount),
          account
        );
        if (res) {
          setLoadingMessage("");
          sendTransaction({
            data: res.data,
            to: res.to,
            value: res.value,
            from: account,
            gasPrice: res.gasPrice,
          });
        }
        console.log(res);
      } catch (error) {
        alert(error);
      }
    } else {
      alert("please connect wallet");
    }
  };

  const handleQuote = async () => {
    if (inputAmount) {
      setLoadingMessage("fetching quote...");
      const quote = await getQuote(tokenIn, tokenOut, Number(inputAmount));

      if (quote) {
        setQuote(quote);
        setLoadingMessage("");
      }
    } else {
      alert("🤷 enter an amount!");
    }
  };

  const buttonStyles = {
    margin: "10px",
    padding: "6px",
    borderRadius: "4px",
    cursor: "pointer",
  };

  //  for testing
  //  vitalikAddress = "0x8289432ACD5EB0214B1C2526A5EDB480Aa06A9ab";
  //  vitalikEnsName = 'wslyvh.eth'
  // const ensName = useEnsName("0x8289432ACD5EB0214B1C2526A5EDB480Aa06A9ab");
  // const ensAddress = useEnsAddress("wslyvh.eth");
  // const avatar = useEnsAvatar(["0x8289432ACD5EB0214B1C2526A5EDB480Aa06A9ab"]);

  // console.log(ensAddress);

  return (
    <div className={styles.view}>
      <button
        style={{
          ...buttonStyles,
          position: "absolute",
          top: 0,
          right: 0,
        }}
        onClick={() => setShowWalletModal(true)}
      >
        Open Wallet Modal
      </button>
      <button style={buttonStyles} onClick={handleGetTokens}>
        get Tokens
      </button>

      <div
        style={{ display: "flex", flexDirection: "column", height: "160px" }}
      >
        <h2>Account Info:</h2>
        <p style={{ margin: "10px" }}>Address: {account ?? "-"}</p>
        {balance && (
          <p style={{ margin: "10px", cursor: "pointer" }}>
            Balance: Ξ {formatEther(balance) ?? "-"}
          </p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <input
          value={address}
          onChange={handleChange}
          type="text"
          placeholder="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
        />
        <br />
        <h2>Swap:</h2>
        <input
          value={inputAmount}
          onChange={handleInputChange}
          type="text"
          placeholder="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
        />
      </div>
      <button onClick={handleQuote}>geyQuote</button>
      <button onClick={handleSwap}>swap</button>

      {showWalletModal && (
        <WalletModal closeModal={() => setShowWalletModal(false)} />
      )}
      {loadingMessage && <p>{loadingMessage}</p>}
    </div>
  );
};

export default PlayGround;
