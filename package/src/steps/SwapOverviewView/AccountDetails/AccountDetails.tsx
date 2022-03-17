import {
  formatEther,
  shortenIfAddress,
  useConnectEnsName,
  useEnsAvatar,
  useEtherBalance,
  useLayer2,
} from "layer2";
import React from "react";
import buttonClasses from "../../../common/ListItemButtonGroup/ListItemButton/ListItemButton.module.css";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { AccountDetailsProps } from "./AccountDetails.models";
import classes from "./AccountDetails.module.css";

const AccountDetails = ({ className }: AccountDetailsProps) => {
  const { account, active } = useLayer2();
  const ensName = useConnectEnsName();
  const ensAvatar = useEnsAvatar([ensName, account]);
  const balance = useEtherBalance(account);

  return account && active ? (
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
        <Jazzicon diameter={45} seed={jsNumberForAddress(account)} />
      )}
      <div className={classes["text-container"]}>
        <div className={classes["account-text"]}>
          <div className={classes["account-big"]}>
            {ensName ?? shortenIfAddress(account)}
          </div>
          {ensName && account && (
            <div className={classes["account-small"]}>
              {shortenIfAddress(account)}
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
