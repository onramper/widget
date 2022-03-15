import React /* , { useContext } */ from "react";
import Header from "../../common/Header";
import BodyLoading from "./BodyLoading";
import styles from "../../styles.module.css";

/* import { NavContext } from "../../NavContext";
import { APIContext } from "../../ApiContext"; */

import { NextStep } from "../../ApiContext/api/types/nextStep";
/* import Step from "../Step";
import ErrorView from "../../common/ErrorView"; */

const LoadingView: React.FC<{
  nextStep: NextStep & { type: "completed" };
}> = () =>
  /*  props */
  {
    /*   const { nextScreen } = useContext(NavContext);

  const { apiInterface } = useContext(APIContext); */

    /*  const handleButtonAction = async (file: File) => {
    try {
      const newNextStep = await apiInterface.executeStep(props.nextStep, file);
      nextScreen(<Step nextStep={newNextStep} />);
    } catch (error) {
      if (error.fatal) {
        nextScreen(<ErrorView />);
        return;
      } else {
      }
    }
  }; */

    return (
      <div className={styles.view}>
        <Header title={`Completing verification`} backButton />
        <BodyLoading />
      </div>
    );
  };

export default LoadingView;
