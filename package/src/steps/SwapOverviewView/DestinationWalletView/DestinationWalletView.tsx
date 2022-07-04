import React, { useCallback, useContext, useEffect, useState } from "react";
import commonClasses from "../../../styles.module.css";
import classes from "./DestinationWalletView.module.css";
import ProgressHeader from "../../../common/Header/ProgressHeader/ProgressHeader";
import Heading from "../../../common/Heading/Heading";
import { NavContext } from "../../../NavContext";
import InfoBox from "../../../common/InfoBox";
import { ButtonAction } from "../../../common/Buttons";
import Footer from "../../../common/Footer";
import ErrorView from "../../../common/ErrorView";
import WalletItem from "./WalletItem/WalletItem";
import WalletInput from "./WalletInput/WalletInput";
import { metamaskWallet } from "../constants";
import {
  useTransactionContext,
  useTransactionCtxWallets,
} from "../../../TransactionContext/hooks";
import { useLayer2 } from "../../../web3/config";

const DestinationWalletView: React.FC = () => {
  const { wallets, selectedWalletAddress } = useTransactionContext();
  const { selectWalletAddress, editWallet, addNewWallet, deleteWallet } =
    useTransactionCtxWallets();
  const [isLoadingAdding, setIsLoadingAdding] = useState(false);

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

  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({});

  const onAddNewWallet = useCallback(async () => {
    setNewWalletAddressError(undefined);
    setIsLoadingAdding(true);

    try {
      await addNewWallet(newWalletAddress);
      setNewWalletAddress("");
    } catch (error) {
      setNewWalletAddressError(
        (error as Error).message || "Something went wrong!"
      );
    } finally {
      setIsLoadingAdding(false);
    }
  }, [addNewWallet, newWalletAddress]);

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

  const isContinueDisabled = useCallback(() => {
    return (
      !!Object.keys(editErrors).length ||
      ![...defaultWallets, ...wallets].some(
        (i) => i.address === selectedWalletAddress
      )
    );
  }, [defaultWallets, editErrors, selectedWalletAddress, wallets]);

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
                loading={isLoadingAdding}
              />
            </div>

            {wallets.map((wallet) => {
              return (
                <WalletItem
                  key={wallet.address}
                  label={wallet.name}
                  address={wallet.address}
                  isChecked={wallet.address === selectedWalletAddress}
                  icon={wallet.icon}
                  onCheck={() => selectWalletAddress(wallet.address)}
                  onEditAddress={(address) => editWallet(wallet, address)}
                  setError={(value) => {
                    if (value) {
                      editErrors[wallet.address] = value;
                    } else {
                      delete editErrors[wallet.address];
                    }
                    setEditErrors({ ...editErrors });
                  }}
                  error={editErrors[wallet.address]}
                  onDelete={() => deleteWallet(wallet.address)}
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
