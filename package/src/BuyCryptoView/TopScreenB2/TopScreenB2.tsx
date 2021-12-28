import React from "react";
import styles from "./TopScreenB2.module.css";
import CurrencyInput from "./CurrencyInput/CurrencyInput";
import CurrencySwitcher from "./CurrencySwitcher/CurrencySwitcher";
import ExpectedAmountPreview from "./ExpectedAmountPreview/ExpectedAmountPreview";

const TopScreenB: React.FC<{}> = () => {
    return <>
        <div className={styles["heading"]}>
            How much do you want to buy?
        </div>

        <div className={styles["exchange-ui-wrapper"]}>
            <CurrencyInput />
            <ExpectedAmountPreview />
            <CurrencySwitcher/>
        </div>
    </>
}

export default TopScreenB;