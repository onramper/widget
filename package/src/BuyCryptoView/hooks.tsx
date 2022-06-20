import { useEffect, useState, useContext, useCallback } from "react";
import { GatewayRateOption, APIContext } from "../ApiContext";
import { SelectGatewayByType } from "../ApiContext/api/types/gateways";
import {
  triggerGTMEvent,
  generateGtmCtxValue,
  GtmEventNames,
  GtmGatewaySelectionType,
  GtmActionTypes,
} from "../helpers/useGTM";
import { useTranslation } from "react-i18next";

export const useGatewaySelectionGtm = () => {
  const {
    collected,
    inputInterface: { handleInputChange },
  } = useContext(APIContext);
  const [gatewayChangeTriggered, setGatewayChangeTriggered] = useState<{
    selectionBy: SelectGatewayByType;
    gateway: GatewayRateOption;
  }>();

  const { t } = useTranslation();
  const [sugestiveGateway, setSuggestiveGateway] = useState<{
    type: SelectGatewayByType;
    gatewayId: string;
  }>();
  const [gatewaySelectionTxt, setGatewaySelectionTxt] = useState("");

  const resoluteGatewayLabel = useCallback(() => {
    if (!collected.selectedGateway || !sugestiveGateway) {
      setGatewaySelectionTxt(t("buyCryptoView.bestRate"));
      return;
    }

    if (sugestiveGateway.gatewayId !== collected.selectedGateway?.id) {
      // TODO: add appropriate translation, or use buyCryptoView.bestRate (once it's decided)
      setGatewaySelectionTxt(t("buyCryptoView.gatewayByUserChoice"));
      return;
    }
    if (sugestiveGateway?.type === SelectGatewayByType.Performance) {
      setGatewaySelectionTxt(t("buyCryptoView.bestPerformance"));
      return;
    }
    setGatewaySelectionTxt(t("buyCryptoView.bestRate"));
  }, [sugestiveGateway, collected.selectedGateway, t]);

  const onGatewayChanged = useCallback(() => {
    if (!gatewayChangeTriggered) {
      return;
    }

    const suggestionType =
      gatewayChangeTriggered.selectionBy === SelectGatewayByType.Performance
        ? GtmGatewaySelectionType.performance
        : GtmGatewaySelectionType.price;

    triggerGTMEvent({
      event: GtmEventNames.GatewaySelection,
      category: gatewayChangeTriggered.gateway?.name,
      label: suggestionType,
      action: GtmActionTypes.manualSelection,
      value: generateGtmCtxValue(collected),
    });
    handleInputChange("lastGatewaySuggestion", suggestionType);

    setSuggestiveGateway({
      type: gatewayChangeTriggered.selectionBy,
      gatewayId: gatewayChangeTriggered.gateway?.id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gatewayChangeTriggered?.gateway, gatewayChangeTriggered?.selectionBy]);

  useEffect(() => {
    onGatewayChanged();
  }, [onGatewayChanged]);

  useEffect(() => {
    resoluteGatewayLabel();
  }, [resoluteGatewayLabel]);

  return {
    registerGtmGatewayChange: setGatewayChangeTriggered,
    gatewaySelectionTxt,
  };
};
