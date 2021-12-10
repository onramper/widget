import React from "react";
import { CryptoListItemRightProps } from "./CryptoListItemRight.models";
import styles from "./CryptoListItemRight.module.css";
import listStyles from "./../../common/ListRedesign/List.module.css";

const CryptoListItemRight: React.FC<CryptoListItemRightProps> = (props) => {
    return (
        <div className={`${listStyles["list-item__right-child"]} ${styles["wrapper"]}`}>
            {props.network && (
                <div className={`${styles["network"]} ${listStyles["list-text"]}`}>{props.network}</div>
            )}
        </div>
    );
};

export default CryptoListItemRight;
