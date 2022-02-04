import { InjectedConnector } from '@web3-react/injected-connector';
import { AbstractConnector } from '@web3-react/abstract-connector';

export interface Wallet {
  id: number;
  name: string;
  connector: AbstractConnector;
  //   //! Some wallets (like Torus) will require extra clean-up to unmount an iframe.
  //   //! Check connector at https://github.com/NoahZinsmeister/web3-react/tree/v6/packages
  //   cleanUp: null | (() => void);
}

export const initializeWallets = (
  chainID: number
  //nodeURL?: string
): Wallet[] => {
  return [
    {
      id: 0,
      name: 'metamask',
      connector: new InjectedConnector({
        supportedChainIds: [chainID],
      }),
      // cleanUp: null,
    },
  ];
};
