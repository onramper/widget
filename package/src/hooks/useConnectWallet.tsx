import { useEthers } from "layer2";
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
  const [connectionError, setConnectionError] = useState<MetamaskError | null>(
    null
  );

  const [connectionPending, setConnectionPending] = useState(false);

  useEffect(() => {
    if (active && account) {
      setConnectionPending(false);
    }
  }, [active, account]);

  useEffect(() => {
    if (error) {
      setConnectionError(error as MetamaskError);
      setConnectionPending(false);
    }
  }, [error]);

  const connect = () => {
    try {
      setConnectionPending(true);
      activateBrowserWallet();
    } catch (error) {
      setConnectionPending(false);
      console.log("caught error");
    }
  };

  const disconnect = () => {
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
