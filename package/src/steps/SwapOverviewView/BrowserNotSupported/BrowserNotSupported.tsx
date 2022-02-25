import React from "react";
import commonClasses from "./../../../styles.module.css";
import classes from "./BrowserNotSupported.module.css";
import ProgressHeader from "../../../common/Header/ProgressHeader/ProgressHeader";
import Footer from "../../../common/Footer";
import Heading from "../../../common/Heading/Heading";
import { useNav } from "../../../NavContext";

const BrowserNotSupported: React.FC<{ currentProgress?: number }> = (props) => {
  const { canGoBack } = useNav();
  
  return (
    <div className={commonClasses.view}>
      <ProgressHeader
        percentage={props.currentProgress}
        useBackButton={canGoBack()}
      />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <Heading
          text="Browser does not support MetaMask"
          textSubHeading="Please switch to a different browser that supports the MetaMask browser extention."
        />
        <div
          className={`${commonClasses["body-form-child"]} ${commonClasses["grow-col"]}`}
        >
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default BrowserNotSupported;
