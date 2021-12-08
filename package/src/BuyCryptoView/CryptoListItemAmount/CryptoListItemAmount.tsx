import React from "react";
import { CryptoListItemAmountProps } from "./CryptoListItemAmount.models";
import styles from "./CryptoListItemAmount.module.css";
import listStyles from "./../../common/ListRedesign/List.module.css";

const CryptoListItemAmount: React.FC<CryptoListItemAmountProps> = (props) => {
    if(!props.amount) {
            return <></>
    };
    
    return (
        <div className={`${listStyles["list-item__right-child"]} ${styles["wrapper"]}`}>
        <div className={`${styles["amount"]} ${listStyles["list-text"]}`}>{props.amount}</div>
        {props.network && (
            <div className={`${styles["network"]} ${listStyles["list-text"]}`}>{props.network}</div>
        )}
        </div>
    );
};

export default CryptoListItemAmount;
