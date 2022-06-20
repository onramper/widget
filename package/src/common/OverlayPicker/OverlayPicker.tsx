import React, { useCallback } from "react";

import { OverlayPickerProps } from "./OverlayPicker.models";
import OverlayView from "../OverlayView/OverlayView";
import ViewList from "../ViewList/ViewList";
import { useGTMDispatch } from "../../hooks/gtm";
import {
  GtmEvent,
  GtmEventAction,
  GtmEventCategory,
  GtmEventLabel,
} from "../../enums";

const PickView: React.FC<OverlayPickerProps> = (props) => {
  const { onItemClick = () => null, name = "" } = props;
  const sendDataToGTM = useGTMDispatch();

  const handleCloseGtmEvent = useCallback(() => {
    if (!props.name || !nameToCloseGtmMap[props.name]) {
      return;
    }
    sendDataToGTM(nameToCloseGtmMap[props.name]);
  }, [props.name, sendDataToGTM]);

  const handleSeachGtmEvent = useCallback(() => {
    if (!props.name || !nameToSeachGtmMap[props.name]) {
      return;
    }
    sendDataToGTM(nameToSeachGtmMap[props.name]);
  }, [props.name, sendDataToGTM]);

  return (
    <OverlayView title={props.title} onClose={handleCloseGtmEvent}>
      <ViewList
        onItemClick={(index, item) => onItemClick(name, index, item)}
        items={props.items}
        searchable={!!props.searchable}
        indexSelected={props.indexSelected}
        onSearchBoxClick={handleSeachGtmEvent}
      />
    </OverlayView>
  );
};

const nameToCloseGtmMap: { [key: string]: any } = {
  crypto: {
    event: GtmEvent.ELEMENT_CLICK,
    action: GtmEventAction.OUT_CURRENCY_SELECTION,
    category: GtmEventCategory.BUTTON,
    label: GtmEventLabel.OUT_CURRENCY_CLOSE,
  },
  currency: {
    event: GtmEvent.ELEMENT_CLICK,
    action: GtmEventAction.IN_CURRENCY_SELECTION,
    category: GtmEventCategory.BUTTON,
    label: GtmEventLabel.IN_CURRENCY_CLOSE,
  },
  paymentMethod: {
    event: GtmEvent.ELEMENT_CLICK,
    action: GtmEventAction.PAYMENT_METHOD_SELECTION,
    category: GtmEventCategory.BUTTON,
    label: GtmEventLabel.PAYMENT_METHOD_CLOSE,
  },
};

const nameToSeachGtmMap: { [key: string]: any } = {
  crypto: {
    event: GtmEvent.ELEMENT_CLICK,
    action: GtmEventAction.OUT_CURRENCY_SELECTION,
    category: GtmEventCategory.FIELD,
    label: GtmEventLabel.OUT_CURRENCY_SEARCH,
  },
  currency: {
    event: GtmEvent.ELEMENT_CLICK,
    action: GtmEventAction.IN_CURRENCY_SELECTION,
    category: GtmEventCategory.FIELD,
    label: GtmEventLabel.IN_CURRENCY_SEARCH,
  },
};

export default PickView;
