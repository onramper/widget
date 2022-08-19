import React, { useContext, useEffect, useState } from "react";
import { APIContext, GatewayRateOption } from "../ApiContext";
import { SelectGatewayByType } from "../ApiContext/api/types/gateways";
import ProgressHeader from "../common/Header/ProgressHeader/ProgressHeader";
import { NavContext } from "../NavContext";
import Step from "../steps/Step";
import BodyLoading from "../steps/WaitView/BodyLoading";
import { getBestGatewayByPerformance, getBestGatewayByPrice } from "../utils";
import styles from "../styles.module.css";
import Footer from "../common/Footer";
import ErrorView from "../common/ErrorView";
import { triggerLandingViewGtmFtcEvent } from "../helpers/useGTM";

const TransactionLoadingView: React.FC = () => {
  const {
    inputInterface,
    collected,
    apiInterface,
    data: {
      allRates,
      availablePaymentMethods,
      availableCryptos,
      availableCurrencies,
    },
  } = useContext(APIContext);
  const { handleInputChange } = inputInterface;
  const { onlyScreen } = useContext(NavContext);
  const { init } = apiInterface;
  const { transaction, isRoutingRequested } = collected;
  const { txnGateway, txnPaymentMethod, txnFiat, txnCrypto, txnAmount } =
    transaction;
  const [initLoadingFinished, setInitLoadingFinished] = useState(false);

  useEffect(() => {
    init().finally(() => {
      setInitLoadingFinished(true);
    });
  }, [init]);

  useEffect(() => {
    return () => handleInputChange("skipTransactionScreen", false);
  }, [handleInputChange]);

  useEffect(() => {
    if (txnAmount === 0 || isNaN(txnAmount))
      onlyScreen(<ErrorView message="Transaction amount is not valid." />);
  }, [onlyScreen, txnAmount]);

  useEffect(() => {
    if (
      allRates.length !== 0 &&
      availableCryptos.findIndex((crypto) => txnCrypto === crypto.id) === -1
    )
      onlyScreen(<ErrorView message="Unsupported crypo currency." />);
  }, [
    allRates.length,
    availableCryptos,
    initLoadingFinished,
    onlyScreen,
    txnCrypto,
  ]);

  useEffect(() => {
    if (
      allRates.length !== 0 &&
      availableCurrencies.findIndex((fiat) => txnFiat === fiat.id) === -1
    )
      onlyScreen(<ErrorView message="Unsupported fiat currency." />);
  }, [
    allRates.length,
    availableCurrencies,
    initLoadingFinished,
    onlyScreen,
    txnFiat,
  ]);

  useEffect(() => {
    if (
      allRates.length !== 0 &&
      availablePaymentMethods.findIndex(
        (paymentMethod) => txnPaymentMethod === paymentMethod.id
      ) === -1
    ) {
      onlyScreen(
        <ErrorView message="Unable to find requested payment method." />
      );
    }
  }, [
    allRates.length,
    availablePaymentMethods,
    initLoadingFinished,
    onlyScreen,
    txnPaymentMethod,
  ]);

  useEffect(() => {
    if (initLoadingFinished && allRates.length !== 0) {
      let selectedGateway: GatewayRateOption | undefined | null =
        txnGateway && allRates.find((rate) => txnGateway === rate.name);

      if (selectedGateway) {
        handleInputChange("selectedGateway", selectedGateway);
      } else if (isRoutingRequested) {
        if (collected.selectGatewayBy === SelectGatewayByType.Performance) {
          selectedGateway = getBestGatewayByPerformance(
            allRates,
            collected.selectedCurrency?.name,
            collected.selectedCrypto?.name,
            collected.staticRouting
          );
          if (selectedGateway)
            handleInputChange("selectedGateway", selectedGateway);
        } else if (collected.selectGatewayBy === SelectGatewayByType.Price) {
          selectedGateway = getBestGatewayByPrice(
            allRates,
            !!collected.amountInCrypto
          );
          handleInputChange("selectedGateway", selectedGateway);
        }

        if (!selectedGateway)
          onlyScreen(<ErrorView message="Unable to find requested onramp." />);
      } else {
        onlyScreen(<ErrorView message="Unable to find requested onramp." />);
      }
    }
  }, [
    collected.amountInCrypto,
    collected.selectGatewayBy,
    collected.selectedCrypto,
    collected.selectedCurrency,
    collected.selectedPaymentMethod,
    collected.staticRouting,
    initLoadingFinished,
    allRates,
    txnGateway,
    handleInputChange,
    isRoutingRequested,
    onlyScreen,
  ]);

  useEffect(() => {
    if (collected.selectedGateway?.nextStep) {
      triggerLandingViewGtmFtcEvent(collected);
      onlyScreen(
        <Step
          nextStep={collected.selectedGateway.nextStep}
          isConfirmed={true}
        />
      );
    }
  }, [collected, collected.selectedGateway, onlyScreen]);

  return (
    <div className={styles.view}>
      <ProgressHeader useBackButton={false} />
      <BodyLoading error={""} />
      <Footer />
    </div>
  );
};

export default TransactionLoadingView;
