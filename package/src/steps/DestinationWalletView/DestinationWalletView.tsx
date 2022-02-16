import React, { useCallback, useContext, useEffect, useState } from "react";
import { DestinationWalletViewProps } from "./DestinationWalletView.models";
import commonClasses from "../../styles.module.css";
import classes from "./DestinationWalletView.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import Heading from "../../common/Heading/Heading";
import { NavContext } from "../../NavContext";
import InfoBox from "../../common/InfoBox";
import ButtonAction from "../../common/ButtonAction";
import Footer from "../../common/Footer";
import ErrorView from "../../common/ErrorView";
import WalletItem from "./WalletItem/WalletItem";

const ComponentName: React.FC<DestinationWalletViewProps> = ({ nextStep }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [defaultWallets] = useState(
    nextStep.data.filter((i) => i.id === "metamask")
  );
  const [wallets, setWallets] = useState(
    nextStep.data.filter((i) => i.id !== "metamask")
  );
  const [walletId, setWalletId] = useState(nextStep.selectedWalletId);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const walletsWrapperRef = React.useRef<HTMLDivElement>(null);

  const { nextScreen, backScreen } = useContext(NavContext);

  const onSubmitAddress = useCallback((address: string, walletId: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (address === "error") {
          return reject(new Error("Incorect address."));
        }

        setWallets(
          wallets.map((i) =>
            i.id === walletId ? { ...i, walletAddress: address } : i
          )
        );
        resolve();
      }, 1000);
    });
  }, [wallets]);

  const onActionButton = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      //   TODO: next step call
      //   const newNextStep = await apiInterface.executeStep(nextStep, {});
      //   nextScreen(<Step nextStep={newNextStep} />);

      backScreen();
    } catch (_error) {
      const error = _error as { fatal: any; message: string };
      if (error.fatal) {
        nextScreen(<ErrorView />);
        return;
      }
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  }, [backScreen, nextScreen]);

  const onDeleteWallet = useCallback((id: string) => {
    setWallets(wallets.filter(i => i.id !== id));
  }, [wallets]);

  useEffect(() => {
    if(!walletsWrapperRef.current) {
      return;
    }
    const value = walletsWrapperRef.current?.scrollHeight > walletsWrapperRef.current?.clientHeight;
    walletsWrapperRef.current.setAttribute("is-overflowing", String(value));
    setIsOverflowing(value);
  }, [defaultWallets.length, wallets.length]);

  const isFilled = false;

  return (
    <div className={commonClasses.view}>
      <ProgressHeader
        percentage={nextStep.progress}
        title={nextStep.title}
        useBackButton
      />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <Heading
          text={nextStep.heading}
          textSubHeading={nextStep.description}
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
            <div className={classes["default-wallets-wrapper"]} >
              {defaultWallets.map((wallet, index) => {
                return (
                  <WalletItem
                    key={index}
                    label={wallet.accountName}
                    title={wallet.walletAddress}
                    address={wallet.walletAddress}
                    info={`Balance: ${wallet.balance} ${nextStep.cryptoName}`}
                    isChecked={wallet.id === walletId}
                    icon={wallet.icon}
                    onCheck={() => setWalletId(wallet.id)}
                    isConnected={wallet.isConnected}
                  />
                );
              })}
              <div className={classes["separator"]}></div>
            </div>
          )}

          <div ref={walletsWrapperRef} is-overflowing={String(isOverflowing)} className={`${commonClasses["sec-scrollbar"]} ${classes["wallets-wrapper"]}`}>
            {wallets.map((wallet, index) => {
              return (
                <WalletItem
                  key={index}
                  label={wallet.accountName}
                  title={wallet.walletAddress}
                  address={wallet.walletAddress}
                  info={`Balance: ${wallet.balance} ${nextStep.cryptoName}`}
                  isChecked={wallet.id === walletId}
                  icon={wallet.icon}
                  onCheck={() => setWalletId(wallet.id)}
                  onSubmitAddress={(value) => onSubmitAddress(value, wallet.id)}
                  onDelete={() => onDeleteWallet(wallet.id)}
                />
              );
            })}
          </div>
        </div>

        <div
          className={`${commonClasses["body-form-child"]}`}
        >
          <ButtonAction
            onClick={onActionButton}
            text={isLoading ? "Sending..." : "Continue"}
            disabled={!isFilled || isLoading}
          />
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default ComponentName;
