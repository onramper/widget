import React from "react";
import { ReactComponent as WalletAddressIcon } from "./../../icons/wallet.svg";
import { ReactComponent as TagIcon } from "./../../icons/tag.svg";
import { ReactComponent as ExpectedTimeIcon } from "./../../icons/expected_time.svg";

export default {
  WalletAddress: <WalletAddressIcon />,
  AddressTag: <TagIcon />,
  ExpectedTransationTime: <ExpectedTimeIcon />,
} as {
  [key: string]: React.ReactNode;
};
