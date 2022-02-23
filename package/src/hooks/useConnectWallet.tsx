import { isMetamaskEnabled, useEthers } from "layer2";
import { useEffect, useState } from "react";

interface ConnectWallet {
  disconnect: () => void;
  connect: () => void;
  connectionPending: boolean;
  error: Error | null;
}

export interface MetamaskError extends Error {
  code: number;
}

export const useConnectWallet = (): ConnectWallet => {
  const { account, active, activateBrowserWallet, deactivate, error } =
    useEthers();
  const [connectionError, setConnectionError] = useState<
    MetamaskError | Error | null
  >(null);

  const [connectionPending, setConnectionPending] = useState(false);

  useEffect(() => {
    if (active && account) {
      setConnectionPending(false);
    }
  }, [active, account]);

  useEffect(() => {
    if (error) {
      // here we can add custom wallet connection errors
      setConnectionError(error as MetamaskError);
      setConnectionPending(false);
    }
  }, [error]);

  const connect = () => {
    if (isMetamaskEnabled()) {
      setConnectionError(null);
      setConnectionPending(true);
      activateBrowserWallet();
    } else {
      setConnectionError(new Error("Metamask not enabled!"));
      setConnectionPending(false);
    }
  };

  const disconnect = () => {
    setConnectionError(null);
    setConnectionPending(false);
    deactivate();
  };

  return {
    disconnect,
    connect,
    connectionPending,
    error: connectionError,
  };
};
