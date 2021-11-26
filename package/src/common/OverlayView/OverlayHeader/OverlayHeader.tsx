import React from "react";
import styles from "./OverlayHeader.module.css";
import commonStyles from "./../../../styles.module.css";
import closeIcon from "./../../../icons/close.svg";
import { OverlayHeaderProps } from "./OverlayHeader.models";

const OverlayHeader: React.FC<OverlayHeaderProps> = (props: OverlayHeaderProps) => {
  return (
    <div className={`${styles["wrapper"]} ${commonStyles["flex-all"]}`}>
      {props.text}
      <button className={`${commonStyles["btn-default"]} ${commonStyles["flex-all"]} ${styles["close-icon-wrapper"]}`} onClick={() => props.close()}>
        <img src={closeIcon} alt="close-icon" />
      </button>
    </div>
  );
};

export default OverlayHeader;
