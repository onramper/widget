import { useEffect, useState, useContext } from "react";
import { GatewayRateOption, APIContext } from "../ApiContext";
import { SelectGatewayByType } from "../ApiContext/api/types/gateways";
import {
  triggerGTMEvent,
  generateGtmCtxValue,
  GtmEventNames,
  GtmGatewaySelectionType,
  GtmActionTypes,
} from "../helpers/useGTM";

export const useGatewaySelectionGtm = () => {
  const {
    collected,
    inputInterface: { handleInputChange },
  } = useContext(APIContext);
  const [gatewayChangeTriggered, setGatewayChangeTriggered] = useState<{
    selectionBy: SelectGatewayByType;
    gateway: GatewayRateOption;
  }>();

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gatewayChangeTriggered?.gateway, gatewayChangeTriggered?.selectionBy]);

  return setGatewayChangeTriggered;
};
