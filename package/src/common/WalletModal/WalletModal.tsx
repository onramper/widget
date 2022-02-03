import React, { useState } from "react";
import { useEthers, isMetamaskEnabled, useLayer2 } from "layer2";
import WalletButton from "./WalletButton/WalletButton";
import styles from "./WalletModal.module.css";

interface Props {
  closeModal: () => void;
}

function WalletModal({ closeModal }: Props) {
  const { activateBrowserWallet, deactivate, account, active } = useEthers();
  const [activatingConnector, setActivatingConnector] = useState<any>();
  const { wallets } = useLayer2();

  const metamaskEnabled = isMetamaskEnabled();
  const enabledWallets = !metamaskEnabled
    ? wallets.filter((wallet: any) => wallet.name !== "metamask")
    : wallets;

  const disconnect = () => {
    deactivate();
    setActivatingConnector(null);
  };

  const isActive = active && account !== undefined;

  const buttons = enabledWallets.map((wallet, index) => {
    const connectFunction = () => {
      setActivatingConnector(wallet.connector);
      try {
        activateBrowserWallet();
      } catch {
        deactivate();
      }
    };

    return (
      <WalletButton
        key={index}
        connectFunction={connectFunction}
        activating={wallet.connector === activatingConnector}
        active={isActive}
        name={wallet.name}
      />
    );
  });

  return (
    <div className={styles.WalletModal}>
      <div>
        <button onClick={closeModal}>X</button>
        {buttons}
      </div>
      {isActive && <button onClick={disconnect}>disconnect</button>}
    </div>
  );
}
export default WalletModal;
