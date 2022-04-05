import React from "react";
import Footer from "../../common/Footer";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import commonClasses from "../../styles.module.css";
import classes from "./TransitionView.module.css";
import { ReactComponent as Mail } from "../../icons/mail.svg";
import Heading from "../../common/Heading/Heading";
import { SingleNotification } from "../WidgetNotification/WidgetNotification";
import { NotificationType } from "../../NotificationContext";

// TODO: discuss interface for data from backend and refactor
interface Props {
  gateway: string; // "Moonpay"
  cryptoReceived: string; // "ETH"
}

export const TransitionView = ({
  gateway = "moonpay",
  cryptoReceived = "eth",
}: Props) => {
  const symbolUpper = cryptoReceived.toUpperCase();

  const notification = {
    type: NotificationType.Info,
    message: "Attention! You do not need to keep your browser open.",
  };

  return (
    <div className={commonClasses.view}>
      <ProgressHeader />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <Mail className={classes.icon} />
        <Heading
          className={classes.heading}
          text="Sep 1 Complete! Payment Received."
          textSubHeading={`${gateway.toLocaleLowerCase()} is sending you your ${symbolUpper}. Once your ${symbolUpper} arrives in your wallet, you will receive an email to complete step 3.`}
        />
      </main>
      <SingleNotification notification={notification} />
      <Footer />
    </div>
  );
};
