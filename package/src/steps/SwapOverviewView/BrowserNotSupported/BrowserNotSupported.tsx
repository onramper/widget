import React from "react";
import commonClasses from "./../../../styles.module.css";
import classes from "./BrowserNotSupported.module.css";
import ProgressHeader from "../../../common/Header/ProgressHeader/ProgressHeader";
import Footer from "../../../common/Footer";
import Heading from "../../../common/Heading/Heading";
import { useNav } from "../../../NavContext";
import { ReactComponent as TriangleExclamationIcon } from "./../../../icons/exclamation-triangle-outline.svg";

const browsers = [
  {
    name: "Chrome",
    link: "https://www.google.com/chrome",
  },
  {
    name: "Firefox",
    link: "https://www.mozilla.org/firefox",
  },
  {
    name: "Brave",
    link: "https://brave.com/download",
  },
];

const BrowserNotSupported: React.FC<{ currentProgress?: number }> = (props) => {
  const { canGoBack } = useNav();

  return (
    <div className={commonClasses.view}>
      <ProgressHeader
        percentage={props.currentProgress}
        useBackButton={canGoBack()}
      />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <div className={classes["top-content"]}>
          <TriangleExclamationIcon className={classes["exclamation-icon"]} />  
        </div>

        <Heading
          text="Browser does not support MetaMask"
          textSubHeading="Please switch to a different browser that supports the MetaMask browser extention."
        />

        <div className={classes["browsers"]}>
          Open in{" "}
          {browsers.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <a href={item.link} target="_blank" rel="noreferrer">
                  {item.name}
                </a>
                {index === browsers.length - 2
                  ? " or "
                  : index < browsers.length - 1
                  ? ", "
                  : ""}
              </React.Fragment>
            );
          })}
          {" "}with the link received in the email.
        </div>

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
