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
import InputDropdown from "../common/InputDropdown/InputDropdown";
import WalletModal from "../common/WalletModal/WalletModal";
import styles from "../styles.module.css";
import inputClasses from "./../common/InputDropdown/InputDropdown.module.css";
import TemporarTransactionErrorTrigger from "./TransactionErrorOverlay/TemporarTransactionErrorTrigger";
import TransactionSettings from "./TransatctionSettings/TransactionSettings";

const SwapCryptoView = () => {
  const { account } = useEthers();
  const { layer2 } = useLayer2();
  const balance = useEtherBalance(account);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const { sendTransaction, state } = useSendTransaction();

  const [amountCoin1, setAmountCoin1] = useState("0.00412");
  const [amountCoin2, setAmountCoin2] = useState("0.000054");

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

      <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: "var(--padding-rl)" }}>
        <TransactionSettings defaultDeadline={600} defaultSlippage={0.1} />
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
      <InputDropdown
        label="You spend"
        value={amountCoin1}
        onChange={(e) => setAmountCoin1(e.target.value)}
        className={inputClasses["swap-screen"]}
        hint="Balance: 0.061"
        onMaxClick={() => {}}
        suffix="($13.16)"
        handleProps={{
          icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEyIiBmaWxsPSIjRURGMEY0Ii8+DQo8cGF0aCBkPSJNMTEuOTY2NiA0Ljc5OTY4TDExLjg3MTEgNS4xMjM5NFYxNC41MzIzTDExLjk2NjYgMTQuNjI3NUwxNi4zMzM3IDEyLjA0NjFMMTEuOTY2NiA0Ljc5OTY4WiIgZmlsbD0iIzM0MzQzNCIvPg0KPHBhdGggZD0iTTExLjk2ODggNC43OTk2OEw3LjYwMTU2IDEyLjA0NjFMMTEuOTY4OCAxNC42Mjc1VjEwLjA2MVY0Ljc5OTY4WiIgZmlsbD0iIzhDOEM4QyIvPg0KPHBhdGggZD0iTTExLjk2MiAxNS40NTQzTDExLjkwODIgMTUuNTE5OVYxOC44NzEzTDExLjk2MiAxOS4wMjgzTDE2LjMzMTggMTIuODc0MUwxMS45NjIgMTUuNDU0M1oiIGZpbGw9IiMzQzNDM0IiLz4NCjxwYXRoIGQ9Ik0xMS45Njg4IDE5LjAyODNWMTUuNDU0M0w3LjYwMTU2IDEyLjg3NDFMMTEuOTY4OCAxOS4wMjgzWiIgZmlsbD0iIzhDOEM4QyIvPg0KPHBhdGggZD0iTTExLjk2NjggMTQuNjI3OEwxNi4zMzQgMTIuMDQ2M0wxMS45NjY4IDEwLjA2MTJWMTQuNjI3OFoiIGZpbGw9IiMxNDE0MTQiLz4NCjxwYXRoIGQ9Ik03LjYwMTU2IDEyLjA0NjNMMTEuOTY4OCAxNC42Mjc4VjEwLjA2MTJMNy42MDE1NiAxMi4wNDYzWiIgZmlsbD0iIzM5MzkzOSIvPg0KPC9zdmc+DQo=",
          value: "ETH",
          disabled: true,
        }}
        useEditIcon
      />

      <InputDropdown
        label="You receive"
        className={inputClasses["swap-screen"]}
        value={amountCoin2}
        onChange={(e) => setAmountCoin2(e.target.value)}
        suffix="($2.32)"
        readonly={true}
        handleProps={{
          icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEyIiBmaWxsPSIjQThFQTU0Ii8+DQo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE2LjkyODYgMTAuMDk4OUMxNy4xNDkyIDguNjIxNzggMTYuMDI0NiA3LjgyNzcyIDE0LjQ4NjcgNy4yOThMMTQuOTg1NiA1LjI5NzA3TDEzLjc2NzMgNC45OTM1M0wxMy4yODE2IDYuOTQxNzNDMTIuOTYxOCA2Ljg2MTk1IDEyLjYzMjkgNi43ODY2NyAxMi4zMDYxIDYuNzEyMDhMMTIuNzk1MiA0Ljc1MTA1TDExLjU3OCA0LjQ0NzUxTDExLjA3ODggNi40NDc3NEMxMC44MTM3IDYuMzg3MzggMTAuNTUzNiA2LjMyNzcyIDEwLjMwMSA2LjI2NDkzTDEwLjMwMjQgNi4yNTg2OEw4LjYyMjcxIDUuODM5MjhMOC4yOTg3MSA3LjE0MDE2QzguMjk4NzEgNy4xNDAxNiA5LjIwMjM5IDcuMzQ3MjYgOS4xODMzMSA3LjM2MDFDOS42NzY2IDcuNDgzMjUgOS43NjYxIDcuODA5NjggOS43NTA4NCA4LjA2ODQ3TDkuMTgyNjEgMTAuMzQ4QzkuMjE2NjEgMTAuMzU2NiA5LjI2MDY3IDEwLjM2OTEgOS4zMDkyMyAxMC4zODg1TDkuMTgwODggMTAuMzU2Nkw4LjM4NDA1IDEzLjU0OTlDOC4zMjM2OCAxMy42OTk3IDguMTcwNyAxMy45MjQ1IDcuODI1ODggMTMuODM5MkM3LjgzODAyIDEzLjg1NjkgNi45NDA1OSAxMy42MTgyIDYuOTQwNTkgMTMuNjE4Mkw2LjMzNTk0IDE1LjAxMjdMNy45MjEyOCAxNS40MDc5QzguMTAwMjMgMTUuNDUyNyA4LjI3NyAxNS40OTg4IDguNDUxODQgMTUuNTQ0NEw4LjQ1MTkyIDE1LjU0NDVMOC40NTIyMyAxNS41NDQ1QzguNTY1MzUgMTUuNTc0MSA4LjY3NzY2IDE1LjYwMzQgOC43ODkyMyAxNS42MzJMOC4yODUxOCAxNy42NTYxTDkuNTAxNzYgMTcuOTU5N0wxMC4wMDEzIDE1Ljk1NzRDMTAuMzMzMyAxNi4wNDc2IDEwLjY1NTkgMTYuMTMwOCAxMC45NzE2IDE2LjIwOTJMMTAuNDc0MSAxOC4yMDIyTDExLjY5MjEgMTguNTA1N0wxMi4xOTYxIDE2LjQ4NTdDMTQuMjczIDE2Ljg3ODcgMTUuODM1MSAxNi43MjAyIDE2LjQ5MTggMTQuODQyMUMxNy4wMjE2IDEzLjMyOTYgMTYuNDY1OCAxMi40NTcxIDE1LjM3MzEgMTEuODg3OUMxNi4xNjg5IDExLjcwMzcgMTYuNzY4MyAxMS4xODAyIDE2LjkyODIgMTAuMDk4OUgxNi45Mjg2Wk0xNC4xNDU0IDE0LjAwMTJDMTMuNzk5NiAxNS4zODk0IDExLjYyNjMgMTQuODE1IDEwLjYzMjggMTQuNTUyNEMxMC41NDM4IDE0LjUyODkgMTAuNDY0MyAxNC41MDc5IDEwLjM5NjQgMTQuNDkxTDExLjA2NTMgMTEuODA5OEMxMS4xNDgyIDExLjgzMDUgMTEuMjQ5NiAxMS44NTMzIDExLjM2NDQgMTEuODc5MUMxMi4zOTIzIDEyLjEwOTcgMTQuNDk4NyAxMi41ODI0IDE0LjE0NTcgMTQuMDAxMkgxNC4xNDU0Wk0xMS41NzExIDEwLjYzNDhDMTIuNCAxMC44NTYgMTQuMjA3IDExLjMzODEgMTQuNTIxOCAxMC4wNzdDMTQuODQzNiA4Ljc4NjkgMTMuMDg2NSA4LjM5ODA2IDEyLjIyODQgOC4yMDgxNkMxMi4xMzE5IDguMTg2ODEgMTIuMDQ2OCA4LjE2Nzk4IDExLjk3NzMgOC4xNTA2NkwxMS4zNzA5IDEwLjU4MjRDMTEuNDI4MyAxMC41OTY3IDExLjQ5NTYgMTAuNjE0NyAxMS41NzExIDEwLjYzNDhaIiBmaWxsPSJ3aGl0ZSIvPg0KPC9zdmc+",
          value: "BTC",
          disabled: true,
        }}
      />

      <TemporarTransactionErrorTrigger />
    </div>
  );
};

export default SwapCryptoView;
