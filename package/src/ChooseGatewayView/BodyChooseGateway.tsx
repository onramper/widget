import React, { useContext } from "react";
import stylesCommon from "../styles.module.css";

import ButtonAction from "../common/ButtonAction";

import { APIContext, GatewayRateOption } from "../ApiContext";
import InfoBox from "../common/InfoBox";
import ErrorVisual from "../common/ErrorVisual";
import RatesList from "./RatesList";
import { useTranslation } from "react-i18next";

type BodyChooseGatewayType = {
  onActionButton?: () => void;
  onItemClick?: (index: number) => void;
  ratesList: GatewayRateOption[];
};

const BodyChooseGateway: React.FC<BodyChooseGatewayType> = (props) => {
  const { t } = useTranslation();
  const { data } = useContext(APIContext);

  const { onActionButton, onItemClick } = props;
  const { ratesList } = props;

  const availableRates = ratesList.filter((el) => el.available);
  const unavailableRates = ratesList.filter((el) => !el.available);
  const hiddenRates = data.mappedHiddenByFiat;

  return (
    <main className={stylesCommon.body}>
      {ratesList.length > 0 ? (
        <>
          <InfoBox
            in={true}
            type="notification"
            className={`${stylesCommon.body__child}`}
          >
            {t('gatewayScreen.noteAboutApproximation')}
          </InfoBox>
          <div className={`${stylesCommon.body__child}`}>
            <RatesList
              availableRates={availableRates}
              unavailableRates={unavailableRates}
              hiddenRates={hiddenRates}
              onItemClick={onItemClick}
            />
          </div>
        </>
      ) : (
        <>
          <InfoBox
            in={true}
            type="info"
            className={`${stylesCommon.body__child}`}
          >
            {t('gatewayScreen.noPricesAvailable')}
          </InfoBox>
          <div className={`${stylesCommon.body__child} ${stylesCommon.grow}`}>
            <ErrorVisual message={t('gatewayScreen.errorConnectingToServerMessage')} />
          </div>
        </>
      )}
      <div className={`${stylesCommon.body__child} ${stylesCommon.grow}`}>
        <ButtonAction
          onClick={onActionButton}
          text={t('gatewayScreen.continueButtonText')}
          disabled={availableRates.length < 1}
        />
      </div>
    </main>
  );
};

export default BodyChooseGateway;
