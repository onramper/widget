import {
  useEtherBalance,
  useEthers,
  formatEther,
  useLayer2,
  QuoteResult,
  useSendTransaction,
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
  const [loadingMessage, setLoadingMessage] = useState("");
  const [quote, setQuote] = useState<QuoteResult>({} as QuoteResult);
  const { sendTransaction, state } = useSendTransaction();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAmount(e.currentTarget.value);
  };

  const handleSwap = async () => {
    if (account) {
      const res = await layer2.getSwapParams(
        Number(inputAmount),
        "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
        account
      );

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
      setLoadingMessage("fetching quote");
      const quote = await layer2.getQuote(
        Number(inputAmount),
        "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
      );
      if (quote) {
        setQuote(quote as QuoteResult);
        setLoadingMessage("");
      }
    } else {
      alert("🤷 enter an amount!");
    }
  };

  return (
    <div className={styles.view}>
      <p style={{ margin: "10px" }}>Address: {account ?? "-"}</p>
      {balance && (
        <p style={{ margin: "10px" }}>
          Balance: Ξ {formatEther(balance) ?? "-"}
        </p>
      )}
      <input
        value={inputAmount}
        onChange={handleChange}
        type="text"
        placeholder="0.00"
      />
      <button onClick={handleQuote}>get quote</button>
      <button onClick={handleSwap}>SWAP</button>

      <button
        style={{ margin: "10px" }}
        onClick={() => setShowWalletModal(true)}
      >
        Open Wallet Modal
      </button>

      {showWalletModal && (
        <WalletModal closeModal={() => setShowWalletModal(false)} />
      )}
      {loadingMessage && <p>{loadingMessage}</p>}
      {quote && <p>{quote.quoteDecimals}</p>}
      {quote && <p>{quote.routeString}</p>}
      {state && <p>{`transaction status: ${state.status}`}</p>}
    </div>
  );
};

export default SwapCryptoView;
