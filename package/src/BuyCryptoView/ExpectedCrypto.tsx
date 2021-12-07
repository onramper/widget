import React, { useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";

import { APIContext } from "../ApiContext";
import { useTranslation } from "react-i18next";

type ExpectedCryptoType = {
  denom: string;
  className?: string;
  isLoading: boolean;
  amountInCrypto?: boolean;
};

const ExpectedCrypto: React.FC<ExpectedCryptoType> = (props) => {
  const { t } = useTranslation();

  const { denom, className, isLoading, amountInCrypto = false } = props;

  const [expectedCrypto, setExpectedCrypto] = useState(0);

  const { data, inputInterface, collected } = useContext(APIContext);
  const { handleInputChange } = inputInterface;

  useEffect(() => {
    let lowest = collected.amountInCrypto
      ? Number.POSITIVE_INFINITY
      : Number.NEGATIVE_INFINITY;
    const comparator = (tmp: number, lowest: number) =>
      collected.amountInCrypto ? tmp < lowest : tmp > lowest;
    let index = 0;
    let tmp: number;
    const pricedRates = data.allRates.filter((item) => item.available);
    for (let i = pricedRates.length - 1; i >= 0; i--) {
      tmp = pricedRates[i].receivedCrypto ?? 0;
      if (comparator(tmp, lowest)) {
        lowest = tmp;
        index = i;
      }
    }

    setExpectedCrypto(pricedRates[index]?.receivedCrypto ?? 0);
  }, [data.allRates, collected.amountInCrypto]);

  useEffect(() => {
    handleInputChange("bestExpectedCrypto", expectedCrypto);
  }, [expectedCrypto, handleInputChange]);

  return (
    <div className={`${styles["expected-crypto"]} ${className}`}>
      <span className={styles["expected-crypto__amount"]}>
        {isLoading ? t('mainScreen.progressMessage') : `${expectedCrypto.toFixed(amountInCrypto ? 2 : 8)} ${denom}`}
      </span>
      <span className={styles["expected-crypto__info"]}>
        {amountInCrypto ? t('mainScreen.noteForFiatAmount') : t('mainScreen.noteForCryptoAmount')}
      </span>
    </div>
  );
};

export default ExpectedCrypto;
