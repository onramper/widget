import { useEffect, useState, useContext } from "react";
import { GatewayRateOption, APIContext } from "../ApiContext";
import { SelectGatewayByType } from "../ApiContext/api/types/gateways";
import { triggerGTMEvent, generateGtmCtxValue } from "../helpers/useGTM";

export const useGatewaySelectionGtm = () => {
  const { collected } = useContext(APIContext);
  const [gatewayChangeTriggered, setGatewayChangeTriggered] = useState<{
    selectionBy: SelectGatewayByType;
    gateway: GatewayRateOption;
  }>();

  useEffect(() => {
    if (!gatewayChangeTriggered) {
      return;
    }

    triggerGTMEvent({
      event: "gateway-selection",
      category: gatewayChangeTriggered.gateway?.name,
      label:
        gatewayChangeTriggered.selectionBy === SelectGatewayByType.Performance
          ? "best"
          : "price",
      action: "manualSelection",
      value: generateGtmCtxValue(collected),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gatewayChangeTriggered?.gateway, gatewayChangeTriggered?.selectionBy]);

  return setGatewayChangeTriggered;
};
