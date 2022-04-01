export const userWalletsResponse = {
  wallets: [
    {
      name: "Account 2",
      address: "0x33e0EDF33Ef70B7F82dB1BC45495923D99AC13C0",
      network: "Mainnet",
    },
    {
      name: "mywallet.eth",
      address: "0x3617B3c3340a4577F8AF15296EcFF152Ad4D6C94",
      network: "Mainnet",
    },
  ],
};

export const updateUserWalletResponse = {
  userId: "13",
  wallet: {
    name: "Account 2",
    address: "0x33e0EDF33Ef70B7F82dB1BC45495923D99AC13C0",
    network: "Mainnet",
  },
};

export const deleteUserWalletResponse = {
  userId: "13",
  address: "0x3617B3c3340a4577F8AF15296EcFF152Ad4D6C94",
};
