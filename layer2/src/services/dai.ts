import { useEthers, useTokenAllowance, useTokenBalance } from '@usedapp/core';

const ERC_20_ADDRESS = '0x_example_address';

export const useDaiBalance = () => {
  const { account } = useEthers();

  return useTokenBalance(ERC_20_ADDRESS, account);
};

export const useDaiAllowance = (spender: string) => {
  const { account } = useEthers();

  return useTokenAllowance(ERC_20_ADDRESS, account, spender);
};
