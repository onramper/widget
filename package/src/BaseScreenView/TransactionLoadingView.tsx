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

const TransactionLoadingView: React.FC = () => {
  const {
    inputInterface,
    collected,
    apiInterface,
    data: { allRates },
  } = useContext(APIContext);
  const { handleInputChange } = inputInterface;
  const { onlyScreen } = useContext(NavContext);
  const { init } = apiInterface;
  const { transaction } = collected;
  const { txnGateway } = transaction;
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
    if (initLoadingFinished && allRates.length !== 0) {
      let selectedGateway: GatewayRateOption | undefined | null =
        txnGateway && allRates.find((rate) => txnGateway === rate.name);
      if (selectedGateway) {
        handleInputChange("selectedGateway", selectedGateway);
      } else if (
        allRates.length !== 0 &&
        collected.selectGatewayBy === SelectGatewayByType.Performance
      ) {
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

      if (!selectedGateway) {
        selectedGateway = getBestGatewayByPrice(
          allRates,
          !!collected.amountInCrypto
        );
        handleInputChange("selectedGateway", selectedGateway);
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
  ]);

  useEffect(() => {
    if (collected.selectedGateway?.nextStep) {
      onlyScreen(
        <Step
          nextStep={collected.selectedGateway.nextStep}
          isConfirmed={true}
        />
      );
    }
  }, [collected.selectedGateway, onlyScreen]);

  return (
    <div className={styles.view}>
      <ProgressHeader />
      <BodyLoading error={""} />
      <Footer />
    </div>
  );
};

export default TransactionLoadingView;
