import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { APIContext } from "../ApiContext";
import { SelectGatewayByType } from "../ApiContext/api/types/gateways";

export const useGatewaySelection = () => {
  const { collected } = useContext(APIContext);

  const { t } = useTranslation();
  const [gatewaySelectionTxt, setGatewaySelectionTxt] = useState("");

  const resoluteGatewayLabel = useCallback(() => {
    if (collected.selectGatewayBy === SelectGatewayByType.Price)
      setGatewaySelectionTxt(t("buyCryptoView.bestRate"));

    if (collected.selectGatewayBy === SelectGatewayByType.Performance)
      setGatewaySelectionTxt(t("buyCryptoView.bestPerformance"));

    if (collected.selectGatewayBy === SelectGatewayByType.NotSuggested)
      setGatewaySelectionTxt(t("buyCryptoView.basic"));
  }, [collected.selectGatewayBy, t]);

  useEffect(() => {
    resoluteGatewayLabel();
  }, [resoluteGatewayLabel, collected.selectedGateway]);

  return {
    gatewaySelectionTxt,
  };
};
