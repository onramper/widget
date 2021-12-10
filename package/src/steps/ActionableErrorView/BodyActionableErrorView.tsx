import React, { useContext, useState, useEffect } from "react";
import stylesCommon from "../../styles.module.css";
import styles from "./styles.module.css";

import { NavContext } from "../../NavContext";
import { APIContext, NextStep } from "../../ApiContext";
import BuyCryptoView from "../../BuyCryptoView";

import { ReactComponent as ERROR } from "../../icons/error.svg";
import ChooseGatewayView from "../../ChooseGatewayView";
import { executeStep } from "../../ApiContext/api";
import Step from "../Step";

type ActionableErrorViewType = {
  title?: string;
  message?: string;
  fatal?: boolean;
  step?: NextStep;
  optionalUrl?: string;
};

const BodyActionableErrorView: React.FC<ActionableErrorViewType> = (props) => {

  const { replaceScreen, nextScreen } = useContext(NavContext);
  const { collected } = useContext(APIContext);

  return (
    <main className={`${stylesCommon.body}`}>
      <div
        className={`${stylesCommon.body__child} ${stylesCommon.grow} ${styles.body}`}
      >

        <ERROR className={styles["fail-icon"]} />

        {!!props.title && (
          <span className={styles.title}>
            { props.title }
          </span>
        )}
        <span className={styles.info}>
          {props.message ? props.message : "Something has gone wrong. Please try again."}
        </span>


        {!!props.optionalUrl  && (
          <button
          onClick={ () => window.open(props.optionalUrl, "_parent") }
          className={`${styles["button--basic"]} ${
            styles["button--instant"]
          }`}
        >
          { "Contact Coinify" }
        </button>
        )}

        {(!!props.step || props.fatal! === true) &&
          (<button
            onClick={
            (props.fatal === false) ?
              () => {
                replaceScreen(<Step nextStep={props.step as NextStep} />);
              }
            : () => {
                nextScreen(<ChooseGatewayView />);
              } }
            className={`${styles["button--basic"]} ${
              styles["button--instant"]
            }`}
          >
            { props.fatal === false ? "Try again" : "Finish" }
          </button>
          )}
      </div>
    </main>
  );
};

BodyActionableErrorView.defaultProps = {};

export default BodyActionableErrorView;
