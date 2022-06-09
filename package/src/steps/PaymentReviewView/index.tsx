import React, { useCallback, useContext, useState } from "react";
import BodyConfirmPayment from "./BodyPaymentReview";
import commonClasses from "../../styles.module.css";
import classes from "./PaymentReview.module.css";
import Step from "../Step";
import { NavContext } from "../../NavContext";
import { APIContext } from "../../ApiContext";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import ErrorView from "../../common/ErrorView";
import { PaymentReviewProps } from "./PaymentReview.models";
import { PayamentReviewDataItem } from "../../ApiContext/api/types/nextStep";
import iconsMapping from "./iconsMapping";

const decorateOverviewItems = (data: PayamentReviewDataItem[]) => {
  return data.map((dataItem) => {
    dataItem.items = dataItem.items.map((item) => {
      if (!item.name) {
        return item;
      }

      if (item.name === "fiatCurrency") {
        item.className = classes["fiat-currency"];
        return item;
      }

      if (item.name === "cryptoCurrency") {
        item.className = classes["crypto-currency"];
        return item;
      }

      if (iconsMapping[item.name]) {
        item.icon = iconsMapping[item.name];
        return item;
      }

      return item;
    });
    return dataItem;
  });
};

const ConfirmPaymentView: React.FC<PaymentReviewProps> = (props) => {
  const { nextScreen } = useContext(NavContext);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const { apiInterface } = useContext(APIContext);
  const [overviewItems] = useState(decorateOverviewItems(props.nextStep.data));

  const onButtonAction = useCallback(async () => {
    if (props.onButtonAction) {
      props.onButtonAction();
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);
    try {
      const newNextStep = await apiInterface.executeStep(props.nextStep, {});
      nextScreen(
        <Step gtmToBeRegisterStep={props.nextStep} nextStep={newNextStep} />
      );
    } catch (_error) {
      const error = _error as { fatal: any; message: string };
      if (error.fatal) {
        nextScreen(<ErrorView />);
        return;
      }
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  }, [apiInterface, nextScreen, props]);

  return (
    <div className={commonClasses.view}>
      <ProgressHeader
        percentage={props.nextStep.progress}
        title={!props.nextStep.useHeading ? props.nextStep.title : undefined}
        useBackButton
      />
      <BodyConfirmPayment
        onActionButton={onButtonAction}
        heading={props.nextStep.useHeading ? props.nextStep.title : undefined}
        subHeading={props.nextStep.description}
        errorMessage={errorMessage}
        isLoading={isLoading}
        overviewSteps={overviewItems}
      />
    </div>
  );
};

export default ConfirmPaymentView;
