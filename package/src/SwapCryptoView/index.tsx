import { useEtherBalance, useEthers, formatEther } from "layer2";
import React, { useState } from "react";
import WalletModal from "../common/WalletModal/WalletModal";
import styles from "../styles.module.css";

const SwapCryptoView = () => {
  const { account } = useEthers();
  const balance = useEtherBalance(account);
  const [showWalletModal, setShowWalletModal] = useState(false);

  return (
    <div className={styles.view}>
      <p style={{ margin: "10px" }}>Address: {account ?? "-"}</p>
      {balance && (
        <p style={{ margin: "10px" }}>
          Balance: Ξ {formatEther(balance) ?? "-"}
        </p>
      )}

      <button
        style={{ margin: "10px" }}
        onClick={() => setShowWalletModal(true)}
      >
        Open Wallet Modal
      </button>

      {showWalletModal && (
        <WalletModal closeModal={() => setShowWalletModal(false)} />
      )}
    </div>
  );
};

export default SwapCryptoView;
