import React, { useContext, useState, useEffect } from "react";
import commonStyles from "../styles.module.css";
import styles from "./styles.module.css";
import { APIContext, GatewayRateOption } from "../ApiContext";
import OverlayView from "../common/OverlayView/OverlayView";
import FallbackErrorView from "./FallbackErrorView";
import RatesList from "./RatesList";

const ChooseGatewayView = () => {
  const { data } = useContext(APIContext);
  const [availableRates, setAvailableRates] = useState<GatewayRateOption[]>([]);
  const [unavailableRates, setUnavailableRates] = useState<GatewayRateOption[]>(
    []
  );

  useEffect(() => {
    const availableRates = data.allRates.filter((g) => g.available);
    setAvailableRates(availableRates);

    const unavailableRates = data.allRates.filter((el) => !el.available);
    setUnavailableRates(unavailableRates);
  }, [data.allRates]);

  return (
    <OverlayView title="Onramps" footerBtnTxt="Choose Onramp">
      {data.allRates.length === 0 && <FallbackErrorView />}

      {data.allRates.length > 0 && (
        <>
          <main className={`${commonStyles.body} ${styles.body}`}>
            <div className={`${commonStyles.body__child}`}>
              <RatesList
                availableRates={availableRates}
                unavailableRates={unavailableRates}
                hiddenRates={data.mappedHiddenByFiat}
              />
            </div>
          </main>
        </>
      )}
    </OverlayView>
  );
};

export default ChooseGatewayView;
