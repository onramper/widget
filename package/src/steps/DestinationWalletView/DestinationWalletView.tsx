import React, { useCallback, useContext, useState } from "react";
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
  const [wallets, setWallets] = useState(nextStep.data);
  const [walletId, setWalletId] = useState(nextStep.selectedWalletId);

  const { nextScreen, backScreen } = useContext(NavContext);

  const onSubmitAddress = useCallback((address: string, walletId: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (address === "error") {
          reject(new Error("Incorect address."));
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

        <div>
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
                // TODO: use a constant for metamask
                onCheck={() => setWalletId(wallet.id)}
                onSubmitAddress={(value) => onSubmitAddress(value, wallet.id)}
                isConnected={wallet.id === "metamask"}
                onDelete={wallet.id === "metamask" ? undefined : () => {}}
              />
            );
          })}
        </div>

        <div
          className={`${commonClasses["body-form-child"]} ${commonClasses["grow-col"]}`}
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
