import {
  formatEther,
  shortenIfAddress,
  useEtherBalance,
  useLayer2,
  useEnsName,
  useEnsAvatar,
} from "layer2";
import React from "react";
import buttonClasses from "../../../common/ListItemButtonGroup/ListItemButton/ListItemButton.module.css";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { AccountDetailsProps } from "./AccountDetails.models";
import classes from "./AccountDetails.module.css";
import { useTransactionContext } from "../../../TransactionContext/hooks";

const AccountDetails = ({ className }: AccountDetailsProps) => {
  const { selectedWalletAddress } = useTransactionContext();
  const { active } = useLayer2();
  const ensName = useEnsName(selectedWalletAddress);
  const ensAvatar = useEnsAvatar([ensName, selectedWalletAddress]);
  const balance = useEtherBalance(selectedWalletAddress);

  return selectedWalletAddress && active ? (
    <div
      className={`${buttonClasses["list-item"]} ${classes.AccountDetails} ${className}`}
    >
      {ensAvatar ? (
        <img
          className={`${buttonClasses["list-icon"]} ${classes.icon}`}
          src={ensAvatar}
          alt="user ens avatar"
        />
      ) : (
        <Jazzicon
          diameter={45}
          seed={jsNumberForAddress(selectedWalletAddress)}
        />
      )}
      <div className={classes["text-container"]}>
        <div className={classes["account-text"]}>
          <div className={classes["account-big"]}>
            {ensName ?? shortenIfAddress(selectedWalletAddress)}
          </div>
          {ensName && selectedWalletAddress && (
            <div className={classes["account-small"]}>
              {shortenIfAddress(selectedWalletAddress)}
            </div>
          )}
        </div>
        <div className={classes["account-balance"]}>
          {`Balance: ${
            balance ? formatEther(balance).slice(0, 5) : "0.00"
          } ETH`}
        </div>
      </div>
    </div>
  ) : null;
};

export default AccountDetails;
