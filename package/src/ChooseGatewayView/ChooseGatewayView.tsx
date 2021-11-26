import React, { useContext, useState, useEffect, useCallback } from "react";
import stylesCommon from "../styles.module.css";
import { APIContext, GatewayRateOption } from "../ApiContext";
import OverlayView from "../common/OverlayView/OverlayView";
import FallbackErrorView from "./FallbackErrorView";
import InfoBox from "../common/InfoBox";
import RatesList from "./RatesList";
import { cryptoAmountsWarning } from "./constants";

const ChooseGatewayView = () => {
  const { data, inputInterface, collected } = useContext(APIContext);
  const { handleInputChange } = inputInterface;

  const [selectedGatewayIndex, setSelectedGatewayIndex] = useState(-1);
  const [availableRates, setAvailableRates] = useState<GatewayRateOption[]>([]);
  const [unavailableRates, setUnavailableRates] = useState<GatewayRateOption[]>([]);

  const getInitialIndex = useCallback(() => {
    if(!collected.selectedGateway) {
      return 0;
    }
    return Math.max(0, data.allRates.findIndex(i => i.id === collected.selectedGateway?.id));
  }, [collected.selectedGateway, data.allRates]);

  useEffect(() => {
    const availableRates = data.allRates.filter((g) => g.available);
    setAvailableRates(availableRates);

    const unavailableRates = data.allRates.filter((el) => !el.available);
    setUnavailableRates(unavailableRates);
  }, [data.allRates]);

  useEffect(() => {
    if(selectedGatewayIndex >= 0) {
      handleInputChange("selectedGateway", availableRates[selectedGatewayIndex]);
    }
  }, [handleInputChange, selectedGatewayIndex, availableRates, getInitialIndex]);

  useEffect(() => {
    if(selectedGatewayIndex === -1) {
      setSelectedGatewayIndex(getInitialIndex());
    }
  }, [getInitialIndex, selectedGatewayIndex])

  return (
    <OverlayView title="Choose seller">
      {data.allRates.length === 0 && <FallbackErrorView />}

      {data.allRates.length > 0 && (
        <main className={stylesCommon.body}>
          <InfoBox in={true} type="notification" className={`${stylesCommon.body__child}`}>
            {cryptoAmountsWarning}
          </InfoBox>
          <div className={`${stylesCommon.body__child}`}>
            <RatesList
              availableRates={availableRates}
              unavailableRates={unavailableRates}
              hiddenRates={data.mappedHiddenByFiat}
              onItemClick={setSelectedGatewayIndex}
            />
          </div>
        </main>
      )}
    </OverlayView>
  );
};

export default ChooseGatewayView;
