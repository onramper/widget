import { Config, useEthers, DAppProvider } from "@usedapp/core";
import React, { createContext, ReactNode, useContext } from "react";
import { useConnectEnsName, useEnsAvatar } from "./hooks/ens";

const infuraProjectId = "bb5c9b186fcf4139865a530801c160f9";

//TODO: create function to set valid chains and respective urls

export const config: Config = {
  autoConnect: false,
  readOnlyUrls: {
    1: `https://mainnet.infura.io/v3/${infuraProjectId}`,
    3: `https://ropsten.infura.io/v3/${infuraProjectId}`, // Moonpay sell Ropsten eth for sandbox env
    // [4]: `https://rinkeby.infura.io/v3/${infuraProjectId}`,
    // [5]: `https://goerli.infura.io/v3/${infuraProjectId}`,
  },
  notifications: {
    expirationPeriod: 30000,
    checkInterval: 2000,
  },
};

interface EnsState {
  ensName: string | null;
  ensAvatar: string | null;
}

export interface ProviderProps {
  children?: ReactNode;
}

const EnsContext = createContext({} as EnsState);

const EnsProvider = ({ children }: ProviderProps) => {
  const { account } = useEthers();
  const ensName = useConnectEnsName();
  const ensAvatar = useEnsAvatar([ensName, account]);
  const ensPayload = {
    ensName: ensName,
    ensAvatar: ensAvatar,
  };

  return (
    <EnsContext.Provider value={ensPayload}>{children}</EnsContext.Provider>
  );
};

export const L2Provider = ({ children }: ProviderProps) => {
  return (
    <DAppProvider config={config}>
      <EnsProvider>{children}</EnsProvider>
    </DAppProvider>
  );
};

export const useLayer2 = () => {
  return useEthers();
};

export const useEns = () => {
  return useContext(EnsContext);
};
