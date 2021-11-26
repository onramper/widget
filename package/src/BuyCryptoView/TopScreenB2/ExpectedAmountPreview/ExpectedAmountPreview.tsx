import React, { useContext, useEffect, useState } from "react";
import styles from "./ExpectedAmountPreview.module.css";
import commonStyles from "../../../styles.module.css";
import { APIContext } from "../../../ApiContext";

const ExpectedAmountPreview: React.FC = () => {
  const { data, inputInterface, collected } = useContext(APIContext);
  const { handleInputChange } = inputInterface;

  const [expectedCrypto, setExpectedCrypto] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>();

  const unitName = collected.amountInCrypto
    ? collected.selectedCurrency?.name
    : collected.selectedCrypto?.name;

  useEffect(() => {
    const setAmountByBestRateAvailable = () => {
      let lowest = collected.amountInCrypto ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
      const comparator = (tmp: number, lowest: number) =>
        collected.amountInCrypto ? tmp < lowest : tmp > lowest;
      
      const pricedRates = data.allRates.filter((item) => item.available);
      let index = 0;
      let tmp: number;
      for (let i = pricedRates.length - 1; i >= 0; i--) {
        tmp = pricedRates[i].receivedCrypto ?? 0;
        if (comparator(tmp, lowest)) {
          lowest = tmp;
          index = i;
        }
      }
  
      setExpectedCrypto(pricedRates[index]?.receivedCrypto ?? 0);
    }

    setAmountByBestRateAvailable();
  }, [data.allRates, collected.amountInCrypto]);

  useEffect(() => {
    handleInputChange("bestExpectedCrypto", expectedCrypto);
  }, [expectedCrypto, handleInputChange]);

  useEffect(() => {
    setErrorMessage(
      ["MIN", "MAX"].some((i) => i === collected.errors?.RATE?.type)
        ? collected.errors?.RATE?.message
        : undefined
    );
  }, [collected.errors]);

  if(errorMessage) {
    return <div className={styles["error-text"]}> {errorMessage}</div>;
  }

  return (
    <div className={styles["text-status"]}>
      {(() => {
        if (collected.isCalculatingAmount) {
          return "Fetching best price...";
        }

        const qtyText = `${expectedCrypto.toFixed(collected.amountInCrypto ? 2 : 8)} ${unitName}`;
        const qtyDescription = collected.amountInCrypto ? `Amount you pay: ` : `You get `;
        return (
          <>
            {qtyDescription}
            <span className={commonStyles["bold"]}>{qtyText}</span>
          </>
        );
      })()}
    </div>
  );
};

export default ExpectedAmountPreview;
