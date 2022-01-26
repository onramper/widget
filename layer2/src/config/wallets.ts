import { InjectedConnector } from '@web3-react/injected-connector';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { CHAIN_ID } from './config';

export interface Wallet {
  name: string;
  connector: AbstractConnector;
  //   //! Some wallets (like Torus) will require extra clean-up to unmount an iframe.
  //   //! Check connector at https://github.com/NoahZinsmeister/web3-react/tree/v6/packages
  //   cleanUp: null | (() => void);
}

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [CHAIN_ID],
});

export const wallets: Wallet[] = [
  {
    name: 'metamask',
    connector: injectedConnector,
    // cleanUp: null,
  },
];
