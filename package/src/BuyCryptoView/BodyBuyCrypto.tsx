import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import stylesCommon from "../styles.module.css";
import { ButtonAction } from "../common/Buttons";
import { APIContext, GatewayRateOption } from "../ApiContext";
import type { ItemType } from "../ApiContext";
import { NavContext } from "../NavContext";
import PaymentMethodPicker from "./PaymentMethodPicker/PaymentMethodPicker";
import GatewayIndicator from "./GatewayIndicator/GatewayIndicator";
import { IGatewaySelected } from "./GatewayIndicator/GatewayIndicator.models";
import errorTypes from "./../ApiContext/api/errorTypes";
import TopScreenB2 from "./TopScreenB2/TopScreenB2";
import NotificationSection from "./NotificationSection/NotificationSection";
import Step from "./../steps/Step";
import TopScreenA from "./ScreenA/TopScreenA";
import OverlayPicker from "../common/OverlayPicker/OverlayPicker";
import { getBestGatewayByPrice, getBestGatewayByPerformance } from "../utils";
import { LoadingItem } from "./constants";
import { IBodyBuyCryptoProps } from "./BuyCryptoView.models";
import Footer from "../common/Footer";
import { useTranslation } from "react-i18next";
import { triggerLandingViewGtmFtcEvent } from "../helpers/useGTM";
import { StepType } from "../ApiContext/api/types/nextStep";
import { SelectGatewayByType } from "../ApiContext/api/types/gateways";
import { useGatewaySelectionGtm } from "./hooks";
import { useGTMDispatch } from "../hooks/gtm";
import {
  buyBtnClickGtmEvent,
  genPaymentMethodSelectEvent,
} from "../hooks/gtm/buyCryptoViewEvents";

function mapGatewaySelectedToPicker(
  selectedGateway?: GatewayRateOption
): IGatewaySelected | undefined {
  if (!selectedGateway) {
    return;
  }
  return {
    name: selectedGateway.name,
    icon: selectedGateway.icon || "",
    rate: selectedGateway.rate,
  };
}

const BodyBuyCrypto: React.FC<IBodyBuyCryptoProps> = (props) => {
  const { t } = useTranslation();
  const {
    onBuyCrypto,
    handleInputChange,
    selectedCrypto = LoadingItem,
    selectedPaymentMethod = LoadingItem,
    isFilled = true,
  } = props;
  const {
    collected,
    data: { availablePaymentMethods, allRates, handlePaymentMethodChange },
  } = useContext(APIContext);
  const { nextScreen, backScreen } = useContext(NavContext);

  const [hasMinMaxErrorsMsg, setHasMinMaxErrorsMsg] = useState<boolean>();
  const [isGatewayInitialLoading, setIsGatewayInitialLoading] =
    useState<boolean>(true);
  const [showScreenA, setShowScreenA] = useState(false);
  const sendDataToGTM = useGTMDispatch();
  const { gatewaySelectionTxt } = useGatewaySelectionGtm();

  useEffect(() => {
    const errType = collected.errors?.RATE?.type;
    setHasMinMaxErrorsMsg(
      [errorTypes.MIN, errorTypes.MAX].some((i) => i === errType) &&
        !!collected.errors?.RATE?.message
    );
  }, [collected.errors]);

  const isNextStepConfirmed = useCallback(() => {
    if (!collected.selectedGateway) return false;

    const nextStep = collected.selectedGateway?.nextStep;
    if (!nextStep) return false;

    return (
      collected.selectedGateway.identifier === "Wyre" &&
      nextStep.type === StepType.form &&
      nextStep.data.some((field) => field.name === "ccNumber")
    );
  }, [collected.selectedGateway]);

  const onNextStep = useCallback(() => {
    sendDataToGTM(buyBtnClickGtmEvent);
    if (!collected.selectedGateway) {
      return;
    }

    triggerLandingViewGtmFtcEvent(collected);
    nextScreen(
      <Step
        nextStep={collected.selectedGateway.nextStep}
        isConfirmed={!isNextStepConfirmed()}
      />
    );
  }, [collected, isNextStepConfirmed, nextScreen, sendDataToGTM]);

  const openMorePaymentOptions = useCallback(() => {
    if (availablePaymentMethods.length > 1) {
      nextScreen(
        <OverlayPicker
          name="paymentMethod"
          title="Select payment method"
          indexSelected={availablePaymentMethods.findIndex(
            (m) => m.id === collected.selectedPaymentMethod?.id
          )}
          items={availablePaymentMethods}
          onItemClick={(name: string, index: number, item: ItemType) => {
            handlePaymentMethodChange(item);
            sendDataToGTM(genPaymentMethodSelectEvent(item.id));
            backScreen();
          }}
        />
      );
    }
  }, [
    availablePaymentMethods,
    backScreen,
    collected.selectedPaymentMethod?.id,
    handlePaymentMethodChange,
    nextScreen,
    sendDataToGTM,
  ]);

  useEffect(() => {
    if (collected.selectGatewayBy === SelectGatewayByType.Performance) {
      const gatewayByPerformance = getBestGatewayByPerformance(
        allRates,
        collected.selectedCurrency?.name,
        collected.selectedCrypto?.name,
        collected.staticRouting
      );
      if (gatewayByPerformance) {
        handleInputChange("selectedGateway", gatewayByPerformance);
        return;
      }
    }

    const gatewayByPrice = getBestGatewayByPrice(
      allRates,
      !!collected.amountInCrypto
    );
    handleInputChange("selectedGateway", gatewayByPrice);
  }, [
    allRates,
    collected.amountInCrypto,
    collected.selectGatewayBy,
    collected.selectedCrypto,
    collected.selectedCurrency,
    collected.selectedPaymentMethod,
    handleInputChange,
    collected.staticRouting,
  ]);

  useEffect(() => {
    if (isGatewayInitialLoading) {
      setIsGatewayInitialLoading(
        !props.initLoadingFinished || collected.isCalculatingAmount
      );
    }
  }, [
    props.initLoadingFinished,
    collected.isCalculatingAmount,
    isGatewayInitialLoading,
  ]);

  useLayoutEffect(() => {
    setShowScreenA(
      new URLSearchParams(window.location.search).get("showScreenA") === "1"
    );
  }, []);

  return (
    <main className={stylesCommon.body}>
      <NotificationSection onBuyCrypto={onBuyCrypto} />

      {showScreenA && <TopScreenA />}
      {!showScreenA && <TopScreenB2 />}

      <PaymentMethodPicker
        openMoreOptions={openMorePaymentOptions}
        selectedId={selectedPaymentMethod.id}
        items={availablePaymentMethods}
        onChange={props.handlePaymentMethodChange}
        isLoading={
          !props.initLoadingFinished || availablePaymentMethods.length === 0
        }
      />

      {(!!collected.selectedGateway || isGatewayInitialLoading) &&
        collected.errors?.RATE?.type !== errorTypes.NO_RATES && (
          <GatewayIndicator
            selectedGateway={mapGatewaySelectedToPicker(
              collected.selectedGateway
            )}
            gatewaySelectionTxt={gatewaySelectionTxt}
            unitCrypto={collected.selectedCrypto?.name}
            unitFiat={collected.selectedCurrency?.name}
            openMoreOptions={onBuyCrypto}
            isLoading={collected.isCalculatingAmount}
            isInitialLoading={isGatewayInitialLoading}
            amountInCrypto={!!collected.amountInCrypto}
          />
        )}

      <div className={`${stylesCommon["body__child-grow"]}`}>
        <ButtonAction
          onClick={onNextStep}
          text={`${t("buyCryptoView.buy")} ${selectedCrypto.name}`}
          disabled={
            !isFilled ||
            collected.isCalculatingAmount ||
            hasMinMaxErrorsMsg ||
            [errorTypes.ALL_UNAVAILABLE, errorTypes.NO_RATES].indexOf(
              collected.errors?.RATE?.type || ""
            ) > -1
          }
        />
      </div>
      <Footer />
    </main>
  );
};

export default BodyBuyCrypto;
