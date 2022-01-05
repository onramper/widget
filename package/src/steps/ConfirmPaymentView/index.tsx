import React, { useContext } from "react";
import Header from "../../common/Header";
import BodyConfirmPayment from "./BodyConfirmPayment";
import styles from "../../styles.module.css";
import Step from "../Step";

import { NavContext } from "../../NavContext";
import { APIContext, NextStep } from "../../ApiContext";
import { t } from "i18next";

const ConfirmPaymentView: React.FC<{
  nextStep: NextStep;
  includeCryptoAddr?: boolean;
}> = (props) => {
  const { nextScreen } = useContext(NavContext);
  const { collected } = useContext(APIContext);
  const [walletAddr, setWalletAddr] = React.useState<
    undefined | { address?: string; memo?: string }
  >({
    address: collected.cryptocurrencyAddress?.address,
    memo: collected.cryptocurrencyAddress?.memo,
  });

  React.useEffect(() => {
    setWalletAddr(
      props.includeCryptoAddr
        ? {
            address: collected.cryptocurrencyAddress?.address,
            memo: collected.cryptocurrencyAddress?.memo,
          }
        : undefined
    );
  }, [props.includeCryptoAddr, collected.cryptocurrencyAddress]);

  return (
    <div className={styles.view}>
      <Header title={t('paymentReviewScreen.title')} backButton />
      <BodyConfirmPayment
        onActionButton={() =>
          nextScreen(<Step nextStep={props.nextStep} isConfirmed />)
        }
        payAmount={
          collected.amountInCrypto
            ? collected.selectedGateway?.receivedCrypto || 0
            : collected.amount
        }
        fees={collected.selectedGateway?.fees}
        currency={collected.selectedCurrency?.name}
        cryptoAmount={
          collected.amountInCrypto
            ? collected.amount
            : collected.selectedGateway?.receivedCrypto || 0
        }
        cryptoDenom={collected.selectedCrypto?.name || ""}
        txTime={collected.selectedGateway?.duration}
        cryptoAddr={walletAddr?.address}
        cryptoAddrTag={walletAddr?.memo}
        cryptoIcon={collected.selectedCrypto?.icon}
        paymentMethod={collected.selectedPaymentMethod?.name}
        conversionRate={collected.selectedGateway?.rate}
        isFilled={true}
      />
    </div>
  );
};

export default ConfirmPaymentView;
