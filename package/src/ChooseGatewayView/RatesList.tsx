import React, { useCallback, useContext, useEffect, useState } from "react";
import { APIContext, GatewayRateOption } from "../ApiContext";
import { documents } from "../ApiContext/api/constants";
import { SelectGatewayByType } from "../ApiContext/api/types/gateways";
import { GtmEvent, GtmEventAction, GtmGatewaySelectionType } from "../enums";
import { useGTMDispatch } from "../hooks/gtm";
import { getArrOfMinsMaxs } from "../utils";
import type {
  IGatewayStats,
  IRatesListProps,
} from "./ChooseGatewayView.models";
import GatewayOption from "./GatewayOption";
import styles from "./styles.module.css";

const RatesList: React.FC<IRatesListProps> = (props) => {
  const sendDataToGTM = useGTMDispatch();
  const {
    collected: {
      staticRouting,
      selectedGateway,
      amountInCrypto,
      selectGatewayBy,
    },
    inputInterface: { handleInputChange },
  } = useContext(APIContext);
  const [sortedAvailableRates, setSortedAvailableRates] = useState<
    GatewayRateOption[]
  >([]);

  const getDefaultReceivedCrypto = useCallback(() => {
    return amountInCrypto ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  }, [amountInCrypto]);

  const getStats = useCallback(() => {
    const bestPerformanceGateway = staticRouting?.[0].gateway;
    const requiresPaperIdMap = props.availableRates.reduce((acc, rate) => {
      const hasNoId = (rate.requiredKYC ?? []).some((kyc) => {
        if (typeof kyc === "string") {
          return documents.some((doc) => doc === kyc);
        }

        return kyc.some((kycItem) => documents.some((doc) => doc === kycItem));
      });

      return {
        ...acc,
        [rate.identifier]: hasNoId,
      };
    }, {} as { [key: string]: boolean });

    const defaultReceivedCrypto = getDefaultReceivedCrypto();
    const cheapest = getArrOfMinsMaxs(
      props.availableRates.map((rate) => ({
        name: rate.identifier,
        value: rate.receivedCrypto ?? defaultReceivedCrypto,
      })),
      amountInCrypto ?? false
    );

    return props.availableRates.reduce<IGatewayStats>((acc, rate, index) => {
      const what = bestPerformanceGateway === rate.name.toLowerCase();
      const allbadges = {
        _id: index,
        noId: !requiresPaperIdMap[rate.identifier],
        fast: rate.duration.seconds <= 60 * 10,
        cheapest: cheapest.some((id) => id === rate.identifier),
        fastest: what,
      };
      return {
        ...acc,
        [rate.identifier]: {
          ...allbadges,
          count: Object.values(allbadges).filter(Boolean).length,
        },
      };
    }, {});
  }, [
    amountInCrypto,
    getDefaultReceivedCrypto,
    props.availableRates,
    staticRouting,
  ]);

  const [stats, setStats] = useState(getStats());

  const getSelectionType = useCallback(
    (gatewayStat: any) => {
      if (gatewayStat.cheapest && gatewayStat.fastest) {
        return selectGatewayBy;
      }
      return gatewayStat.cheapest
        ? SelectGatewayByType.Price
        : gatewayStat.fastest
        ? SelectGatewayByType.Performance
        : SelectGatewayByType.Basic;
    },
    [selectGatewayBy]
  );
  const handleOnrampSelectionClose = useCallback(() => {
    if (selectedGateway) {
      const gatewayStat = stats[selectedGateway.name];
      const selectionType = getSelectionType(gatewayStat);
      handleInputChange("selectGatewayBy", selectionType);
    }
  }, [getSelectionType, handleInputChange, selectedGateway, stats]);

  useEffect(() => {
    return handleOnrampSelectionClose();
  }, [handleOnrampSelectionClose]);

  const triggerGtm = useCallback(
    (gatewayName?: string) => {
      sendDataToGTM({
        event: GtmEvent.GATEWAY_SELECTION,
        category: gatewayName,
        label: GtmGatewaySelectionType.PRICE,
        action: GtmEventAction.MANUAL_SELECTION,
      });
    },
    [sendDataToGTM]
  );

  const handleGatewayChange = useCallback(
    (item: GatewayRateOption) => {
      handleInputChange("selectedGateway", item);
      triggerGtm(item.name);
    },
    [handleInputChange, triggerGtm]
  );

  useEffect(() => {
    const defaultReceivedCrypto = getDefaultReceivedCrypto();
    const sortedItems = [...props.availableRates].sort((a, b) => {
      let res = 0;
      if (res === 0)
        res =
          ((b.receivedCrypto ?? defaultReceivedCrypto) -
            (a.receivedCrypto ?? defaultReceivedCrypto)) *
          (amountInCrypto ? -1 : 1);
      if (res === 0) res = a.duration.seconds - b.duration.seconds;
      return res;
    });

    setSortedAvailableRates(sortedItems);
  }, [amountInCrypto, getDefaultReceivedCrypto, props.availableRates]);

  useEffect(() => {
    setStats(getStats);
  }, [getStats]);

  const unavailableRates: GatewayRateOption[] = props.unavailableRates;
  const _unavailableRates = unavailableRates.filter(
    (ur) => !ur.error?.type.match(/MIN|MAX/)
  );
  const _minMaxUnavailableRates = unavailableRates.filter((ur) =>
    ur.error?.type.match(/MIN|MAX/)
  );

  return (
    <ul className={`${styles["rates-list"]}`}>
      {sortedAvailableRates.map((item, i) => (
        <GatewayOption
          key={i}
          index={i}
          isOpen={item.id === selectedGateway?.id}
          selectedReceivedCrypto={selectedGateway?.receivedCrypto}
          onClick={() => handleGatewayChange(item)}
          stats={stats}
          {...item}
        />
      ))}
      {_minMaxUnavailableRates.map((item, i) => (
        <GatewayOption
          key={i}
          index={i}
          isOpen={false}
          selectedReceivedCrypto={0}
          {...item}
        />
      ))}
      {props.hiddenRates.map((item, i) => (
        <GatewayOption
          id={item.identifier}
          name={item.identifier}
          available={false}
          duration={{ seconds: 0, message: "" }}
          key={i}
          index={i}
          isOpen={false}
          selectedReceivedCrypto={0}
          {...item}
        />
      ))}
      {_unavailableRates.map((item, i) => (
        <GatewayOption
          key={i}
          index={i}
          isOpen={false}
          selectedReceivedCrypto={0}
          {...item}
        />
      ))}
    </ul>
  );
};

export default RatesList;
