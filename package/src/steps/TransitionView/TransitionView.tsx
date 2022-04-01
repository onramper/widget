import React from "react";
import Footer from "../../common/Footer";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import commonClasses from "../../styles.module.css";
import classes from "./TransitionView.module.css";
import { ReactComponent as Mail } from "../../icons/mail.svg";

export const TransitionView = () => {
  return (
    <div className={commonClasses.view}>
      <ProgressHeader />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <Mail className={classes.icon} />
        <Footer />
      </main>
    </div>
  );
};
