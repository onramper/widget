import React from "react";
import styles from "./OverlayHeader.module.css";
import commonStyles from "./../../../styles.module.css";
import closeIcon from "./../../../icons/close.svg";
import { OverlayHeaderProps } from "./OverlayHeader.models";
import ButtonAction from "../../ButtonAction";

const OverlayHeader: React.FC<OverlayHeaderProps> = (
  props: OverlayHeaderProps
) => {
  return (
    <div className={`${styles["wrapper"]} ${commonStyles["flex-all"]}`}>
      <div className={styles["text"]}> {props.text} </div>
      {!props.closeBtnTxt && (
        <button
          className={`${commonStyles["btn-default"]} ${commonStyles["flex-all"]} ${styles["close-icon-wrapper"]}`}
          onClick={() => props.close()}
        >
          <img src={closeIcon} alt="close-icon" />
          <div className={styles["clickable-area"]}></div>
        </button>
      )}
      {props.closeBtnTxt && (
        <ButtonAction
          className={styles["close-btn"]}
          onClick={() => props.close()}
          text={props.closeBtnTxt}
        />
      )}
    </div>
  );
};

export default OverlayHeader;
