import React, { useCallback, useContext, useEffect, useState } from "react";
import commonClasses from "../../../styles.module.css";
import classes from "./DestinationWalletView.module.css";
import ProgressHeader from "../../../common/Header/ProgressHeader/ProgressHeader";
import Heading from "../../../common/Heading/Heading";
import { NavContext } from "../../../NavContext";
import InfoBox from "../../../common/InfoBox";
import ButtonAction from "../../../common/Buttons/ButtonAction";
import Footer from "../../../common/Footer";
import ErrorView from "../../../common/ErrorView";
import WalletItem from "./WalletItem/WalletItem";
import WalletInput from "./WalletInput/WalletInput";
import { WalletItemData } from "../../../ApiContext/api/types/nextStep";
import { metamaskWallet } from "../constants";
import { useLayer2 } from "layer2";
import {
  useTransactionContext,
  useTransactionCtxWallets,
} from "../../../TransactionContext/hooks";

const DestinationWalletView: React.FC = () => {
  const { wallets, selectedWalletAddress } = useTransactionContext();
  const { selectWalletAddress, editWallet, updateWallets } =
    useTransactionCtxWallets();

  const [errorMessage, setErrorMessage] = useState<string>();
  const { account: metaAddress } = useLayer2();
  const [defaultWallets, setDefaultWallets] = useState([
    { ...metamaskWallet, address: metaAddress },
  ]);

  const [isOverflowing, setIsOverflowing] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [newWalletError, setNewWalletAddressError] = useState<
    string | undefined
  >();

  const walletsWrapperRef = React.useRef<HTMLDivElement>(null);

  const { nextScreen, backScreen } = useContext(NavContext);

  const onAddNewWallet = useCallback(async () => {
    setNewWalletAddressError(undefined);

    const promise = new Promise<WalletItemData>((resolve, reject) => {
      setTimeout(() => {
        if (!newWalletAddress) {
          return reject(new Error("Value cannot be empty."));
        }

        if (newWalletAddress === "error") {
          return reject(new Error("Incorect address."));
        }

        const newWallet = {
          address: newWalletAddress,
          name: `Account ${wallets.length + 1}`,
          id: `account${wallets.length + 1}`,
          balance: (1000 * Math.random()) | 0,
        };
        resolve(newWallet);
      }, 200);
    });

    try {
      const wallet = await promise;
      setNewWalletAddress("");
      updateWallets([wallet, ...wallets]);
    } catch (_err) {
      const error = _err as Error;
      setNewWalletAddressError(error.message);
    }
  }, [newWalletAddress, updateWallets, wallets]);

  const onActionButton = useCallback(async () => {
    setErrorMessage(undefined);

    try {
      backScreen();
    } catch (_error) {
      const error = _error as { fatal: any; message: string };
      if (error.fatal) {
        nextScreen(<ErrorView />);
        return;
      }
      setErrorMessage(error.message);
    }
  }, [backScreen, nextScreen]);

  const onDeleteWallet = useCallback(
    (address: string) => {
      updateWallets(wallets.filter((i) => i.address !== address));
    },
    [updateWallets, wallets]
  );

  const isContinueDisabled = useCallback(() => {
    return ![...defaultWallets, ...wallets].some(
      (i) => i.address === selectedWalletAddress
    );
  }, [defaultWallets, selectedWalletAddress, wallets]);

  useEffect(() => {
    if (!walletsWrapperRef.current) {
      return;
    }
    const value =
      walletsWrapperRef.current?.scrollHeight >
      walletsWrapperRef.current?.clientHeight;
    walletsWrapperRef.current.setAttribute("is-overflowing", String(value));
    setIsOverflowing(value);
  }, [defaultWallets.length, wallets.length]);

  useEffect(
    () => setDefaultWallets([{ ...metamaskWallet, address: metaAddress }]),
    [metaAddress]
  );

  return (
    <div className={commonClasses.view}>
      <ProgressHeader percentage={0} title={"Your wallet"} useBackButton />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <Heading
          text="Add destination wallet (Optional)"
          textSubHeading="Choose which wallet you would like your funds to be deposited in"
        />
        <InfoBox
          in={!!errorMessage}
          type="error"
          className={`${commonClasses["body-form-child"]}`}
          actionText="Try another gateway"
          onActionClick={() => setErrorMessage("")}
          onDismissClick={() => setErrorMessage("")}
          canBeDismissed
        >
          <span> {errorMessage} </span>
        </InfoBox>

        <div className={classes["main-content"]}>
          {defaultWallets.length > 0 && (
            <div className={classes["default-wallets-wrapper"]}>
              {defaultWallets.map((wallet, index) => {
                return (
                  <WalletItem
                    key={index}
                    label={wallet.name}
                    address={wallet.address || undefined}
                    isChecked={wallet.address === selectedWalletAddress}
                    icon={wallet.icon}
                    onCheck={() => selectWalletAddress(undefined)}
                    isConnected={true}
                  />
                );
              })}
              <div className={classes["separator"]}></div>
            </div>
          )}

          <div
            ref={walletsWrapperRef}
            is-overflowing={String(isOverflowing)}
            className={`${commonClasses["sec-scrollbar"]} ${classes["wallets-wrapper"]}`}
          >
            <div className={classes["input-wrapper"]}>
              <div className={classes["input-label"]}>
                Enter an additional wallet address
              </div>
              <WalletInput
                onSubmit={() => onAddNewWallet()}
                errorMessage={newWalletError}
                value={newWalletAddress}
                onChange={setNewWalletAddress}
              />
            </div>

            {wallets.map((wallet, index) => {
              return (
                <WalletItem
                  key={index}
                  label={wallet.name}
                  address={wallet.address}
                  isChecked={wallet.address === selectedWalletAddress}
                  icon={wallet.icon}
                  onCheck={() => selectWalletAddress(wallet.address)}
                  onEditAddress={(address) => editWallet(wallet, address)}
                  onDelete={() => onDeleteWallet(wallet.address)}
                />
              );
            })}
          </div>
        </div>

        <div
          className={`${commonClasses["body-form-child"]} ${classes["bottom-container"]}`}
        >
          <ButtonAction
            onClick={onActionButton}
            disabled={isContinueDisabled()}
            text={"Save and continue"}
          />
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default DestinationWalletView;
