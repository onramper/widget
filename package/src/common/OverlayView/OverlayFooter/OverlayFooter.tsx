import React from "react";
import styles from "./OverlayFooter.module.css";
import commonStyles from "./../../../styles.module.css";
import { OverlayFooterProps } from "./OverlayFooter.models";
import ButtonAction from "../../ButtonAction";

const OverlayFooter: React.FC<OverlayFooterProps> = (
  props: OverlayFooterProps
) => {
  return (
    <>
      <div className={`${commonStyles["flex-all"]} ${styles.footer}`}></div>
      <div className={`${styles.fbutton}`}>
        <ButtonAction
          onClick={() => props.onOverlayClose()}
          text={props.footerBtnTxt!}
          size="small"
        />
      </div>
    </>
  );
};

export default OverlayFooter;
