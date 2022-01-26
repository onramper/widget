import React, { useCallback, useContext, useState } from "react";
import BodyConfirmPayment from "./BodyConfirmPayment";
import styles from "../../styles.module.css";
import Step from "../Step";

import { NavContext } from "../../NavContext";
import { APIContext } from "../../ApiContext";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import ErrorView from "../../common/ErrorView";
import { PaymentReviewProps } from "./PaymentReview.models";

const ConfirmPaymentView: React.FC<PaymentReviewProps> = (props) => {
  const { nextScreen } = useContext(NavContext);
  const { collected } = useContext(APIContext);
  
  const [walletAddr, setWalletAddr] = React.useState<undefined | { address?: string; memo?: string } >({
    address: collected.cryptocurrencyAddress?.address,
    memo: collected.cryptocurrencyAddress?.memo,
  });
  const [cryptoAmount] = useState(
    collected.amountInCrypto ? collected.amount : (collected.selectedGateway?.receivedCrypto || 0)
  );
  const [payAmount] = useState(
    collected.amountInCrypto ? (collected.selectedGateway?.receivedCrypto || 0) : collected.amount
  );

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const { apiInterface } = useContext(APIContext);

  const onButtonAction = useCallback(async () => {
    if(props.onButtonAction) {
      props.onButtonAction();
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);
    try {
      const newNextStep = await apiInterface.executeStep(props.nextStep, {});
      nextScreen(<Step nextStep={newNextStep} />);
    } catch (_error) {
      const error = _error as { fatal: any, message: string };
      if (error.fatal) {
        nextScreen(<ErrorView />);
        return;
      }
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  }, [apiInterface, nextScreen, props])

  React.useEffect(() => {
    const walletAddress = props.includeCryptoAddr ? {
        address: collected.cryptocurrencyAddress?.address,
        memo: collected.cryptocurrencyAddress?.memo,
      }
    : undefined;

    setWalletAddr(walletAddress);
  }, [props.includeCryptoAddr, collected.cryptocurrencyAddress]);

  return (
    <div className={styles.view}>
      <ProgressHeader
        percentage={props.nextStep.progress}
        title={!props.nextStep.useHeading ? props.nextStep.title : undefined}
        useBackButton
      />
      <BodyConfirmPayment
        onActionButton={onButtonAction}
        payAmount={payAmount}
        fees={collected.selectedGateway?.fees}
        currency={collected.selectedCurrency?.name}
        cryptoAmount={cryptoAmount}
        cryptoDenom={collected.selectedCrypto?.name || ""}
        txTime={collected.selectedGateway?.duration}
        cryptoAddr={walletAddr?.address}
        cryptoAddrTag={walletAddr?.memo}
        cryptoIcon={collected.selectedCrypto?.icon}
        paymentMethod={collected.selectedPaymentMethod?.name}
        conversionRate={collected.selectedGateway?.rate}
        heading={props.nextStep.useHeading ? props.nextStep.title : undefined}
        subHeading={props.nextStep.description}
        errorMessage={errorMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ConfirmPaymentView;
