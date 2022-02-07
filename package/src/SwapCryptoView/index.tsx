import {
  useEtherBalance,
  useEthers,
  formatEther,
  useLayer2,
  QuoteResult,
  useSendTransaction,
  SwapParams,
} from "layer2";
import React, { useState } from "react";
import WalletModal from "../common/WalletModal/WalletModal";
import styles from "../styles.module.css";

const SwapCryptoView = () => {
  const { account } = useEthers();
  const { layer2 } = useLayer2();
  const balance = useEtherBalance(account);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const { sendTransaction, state } = useSendTransaction();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAmount(e.currentTarget.value);
  };

  const CHAIN_ID = 4;

  const handleSwap = async () => {
    if (account) {
      setLoadingMessage("fetching swap data...");
      const res = (await layer2.getSwapParams(
        CHAIN_ID,
        Number(inputAmount),
        "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", // uni address
        account
      )) as SwapParams;
      if (res) setLoadingMessage("");
      sendTransaction({
        data: res.data,
        to: res.to,
        value: res.value,
        from: account,
        gasPrice: res.gasPrice,
      });
      console.log(res);
    } else {
      alert("please connect wallet");
    }
  };

  const handleQuote = async () => {
    if (inputAmount) {
      setLoadingMessage("fetching quote...");
      const quote = await layer2.getQuote(
        CHAIN_ID,
        Number(inputAmount),
        "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984" // uni
      );
      if (quote) {
        setQuote(quote as QuoteResult);
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
        <h2>Swap:</h2>
        <input
          value={inputAmount}
          onChange={handleChange}
          type="text"
          placeholder="0.00"
        />
        <button style={buttonStyles} onClick={handleQuote}>
          get quote
        </button>
        <button style={buttonStyles} onClick={handleSwap}>
          SWAP
        </button>
      </div>

      {showWalletModal && (
        <WalletModal closeModal={() => setShowWalletModal(false)} />
      )}
      {loadingMessage && <p>{loadingMessage}</p>}
      {quote && (
        <div>
          <button style={buttonStyles} onClick={() => setQuote(null)}>
            X
          </button>
          <p>fee breakdown:</p>
          <p>{`Quote: ${quote.quoteDecimals}`}</p>
          <p>{`(estimated gas: ${quote.gasUseEstimate})`}</p>
          <hr />
          <p>{`Final: ${quote.quoteGasAdjustedDecimals}`}</p>
        </div>
      )}
      {state.status !== "None" && <p>{state.status}</p>}
    </div>
  );
};

export default SwapCryptoView;
