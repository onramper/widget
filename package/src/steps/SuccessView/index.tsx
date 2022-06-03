import React from "react";
import BodySuccessView from "./BodySuccessView";
import styles from "../../styles.module.css";
import type { NextStep } from "../../ApiContext";
import { APIContext } from "../../ApiContext";
import { EVENTS, emit } from "../../Onramper";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import { StepType } from "../../ApiContext/api/types/nextStep";

type SuccessViewProps = {
  nextStep: Partial<NextStep> & { type: StepType.completed };
  txType: "instant" | "pending";
};

const SuccessView: React.FC<SuccessViewProps> = (props) => {
  const { collected } = React.useContext(APIContext);

  React.useEffect(() => {
    emit(EVENTS.PURCHASE_COMPLETED, {
      gateway: collected.selectedGateway?.identifier ?? "Onramper",
      trackingUrl: props.nextStep.trackingUrl,
    });
  }, [collected.selectedGateway?.identifier, props.nextStep.trackingUrl]);

  return (
    <div className={styles.view}>
      <ProgressHeader
        title={
          props.txType === "instant" ? "Order processed" : "Order registred"
        }
        useBackButton={props.txType !== "instant"}
      />
      {props.txType === "instant" ? (
        <BodySuccessView
          txType={props.txType}
          trackingURL={props.nextStep.trackingUrl}
        />
      ) : (
        <BodySuccessView txType={props.txType} />
      )}
    </div>
  );
};

export default SuccessView;
