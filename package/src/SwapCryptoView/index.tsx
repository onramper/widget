import {
  useEtherBalance,
  useEthers,
  formatEther,
  useLayer2,
  QuoteResult,
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
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<QuoteResult>({} as QuoteResult);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAmount(e.currentTarget.value);
  };

  const handleClick = async () => {
    account && console.log(layer2.blockExplorerAddressLink(account));
    if (inputAmount) {
      setLoading(true);
      const quote = await layer2.getQuote(
        Number(inputAmount),
        "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
      );
      if (quote) {
        setQuote(quote);
        setLoading(false);
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
      <button onClick={handleClick}>get quote</button>

      <button
        style={{ margin: "10px" }}
        onClick={() => setShowWalletModal(true)}
      >
        Open Wallet Modal
      </button>

      {showWalletModal && (
        <WalletModal closeModal={() => setShowWalletModal(false)} />
      )}
      {loading && <p>fetching quote...</p>}
      {quote && <p>{quote.quote}</p>}
      {quote && <p>{quote.routeString}</p>}
    </div>
  );
};

export default SwapCryptoView;
