import React from "react";
import Header from "../../common/Header";
import BodySuccessView from "./BodySuccessView";
import styles from "../../styles.module.css";
import type { NextStep } from "../../ApiContext";
import { APIContext } from "../../ApiContext";
import { EVENTS, emit } from "../../Onramper";

type SuccessViewProps = {
  nextStep: Partial<NextStep> & { type: "completed" };
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
      <Header
        title={
          props.txType === "instant" ? "Order processed" : "Order registred"
        }
        backButton={props.txType !== "instant"}
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
