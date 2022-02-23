import {
  useEtherBalance,
  useEthers,
  formatEther,
  useLayer2,
  QuoteDetails,
  useSendTransaction,
  InsufficientFundsError,
  OperationalError,
  InvalidParamsError,
  TokenList,
} from "layer2";
import React, { useEffect, useState } from "react";
import WalletModal from "../../common/WalletModal/WalletModal";
import styles from "../../styles.module.css";
import TemporarTransactionErrorTrigger from "../TransactionErrorOverlay/TemporarTransactionErrorTrigger";

const PlayGround = () => {
  const { account } = useEthers();
  const { layer2 } = useLayer2();
  const balance = useEtherBalance(account);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [quote, setQuote] = useState<QuoteDetails | null>(null);
  const { sendTransaction, state } = useSendTransaction();
  const [, setTokenList] = useState<TokenList | null>(null);

  const handleGetTokens = async () => {
    try {
      const list = await layer2.getTokens();
      if (list) {
        setTokenList(list);
      }
    } catch (error) {
      alert("unable to fetch token! 😭");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAmount(e.currentTarget.value);
  };
  const CHAIN_ID = 4;

  const handleSwap = async () => {
    if (account && balance) {
      console.table({
        Balance: Number(formatEther(balance)),
        InputAmount: Number(inputAmount),
      });
      try {
        setLoadingMessage("fetching swap data...");
        const res = await layer2.getSwapParams(
          Number(formatEther(balance)),
          CHAIN_ID,
          Number(inputAmount),
          "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", // uni address
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
        console.error(error);
        if (error instanceof InsufficientFundsError) {
          setLoadingMessage("");
          alert("insufficient funds!");
        }

        if (error instanceof InvalidParamsError) {
          setLoadingMessage("");
          alert("invalid params!");
          console.table(error);
        }
        if (error instanceof OperationalError) {
          setLoadingMessage("");
          alert("operational error!");
        }
      }
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

  useEffect(() => {
    handleGetTokens();
    //eslint-disable-next-line
  }, []);

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

      <TemporarTransactionErrorTrigger />
    </div>
  );
};

export default PlayGround;
