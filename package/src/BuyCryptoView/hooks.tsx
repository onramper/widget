import { useEffect, useState, useContext } from "react";
import { GatewayRateOption, APIContext } from "../ApiContext";
import { SelectGatewayByType } from "../ApiContext/api/types/gateways";
import {
  triggerGTMEvent,
  generateGtmCtxValue,
} from "../helpers/useGTM";
import {
  GtmEvent,
  GtmGatewaySelectionType,
  GtmEventAction,
} from "../../enums";

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
        ? GtmGatewaySelectionType.PERFORMANCE
        : GtmGatewaySelectionType.PRICE;

    triggerGTMEvent({
      event: GtmEvent.GATEWAY_SELECTION,
      category: gatewayChangeTriggered.gateway?.name,
      label: suggestionType,
      action: GtmEventAction.MANUAL_SELECTION,
      value: generateGtmCtxValue(collected),
    });
    handleInputChange("lastGatewaySuggestion", suggestionType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gatewayChangeTriggered?.gateway, gatewayChangeTriggered?.selectionBy]);

  return setGatewayChangeTriggered;
};
