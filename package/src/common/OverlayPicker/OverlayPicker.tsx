import React from "react";

import { OverlayPickerProps } from "./OverlayPicker.models";
import OverlayView from "../OverlayView/OverlayView";
import ViewList from "../ViewList/ViewList";
import { useGTMDispatch } from "../../hooks/gtm";
import {
  GtmEvent,
  GtmEventAction,
  GtmEventCategory,
  GtmEventElement,
  GtmEventLabel,
} from "../../enums";
import { useTranslation } from "react-i18next";

const PickView: React.FC<OverlayPickerProps> = (props) => {
  const { onItemClick = () => null, name = "" } = props;
  const sendDataToGTM = useGTMDispatch();
  const { t } = useTranslation();

  //All overlay retaled GTM events can be handled here
  const handleOverlayGTMEvents = (element: string) => {
    let action;
    let label;
    let category;
    const { title } = props;
    switch (element) {
      case GtmEventElement.CURRENCY_CLOSE:
        label = title.includes(t("header.selectCrypto"))
          ? GtmEventLabel.OUT_CURRENCY_CLOSE
          : GtmEventLabel.IN_CURRENCY_CLOSE;
        action = title.includes(t("header.selectCrypto"))
          ? GtmEventAction.OUT_CURRENCY_CLOSE
          : GtmEventAction.IN_CURRENCY_CLOSE;
        category = GtmEventCategory.BUTTON;
        break;
      case GtmEventElement.CURRENCY_SEARCH:
        label = title.includes(t("header.selectCrypto"))
          ? GtmEventLabel.OUT_CURRENCY_SEARCH
          : GtmEventLabel.IN_CURRENCY_SEARCH;
        action = title.includes(t("header.selectCrypto"))
          ? GtmEventAction.OUT_CURRENCY_SEARCH
          : GtmEventAction.IN_CURRENCY_SEARCH;
        category = GtmEventCategory.FIELD;
        break;
      default:
        return;
    }

    const gtmData = {
      event: GtmEvent.ELEMENT_CLICK,
      action,
      category,
      label,
    };

    sendDataToGTM(gtmData);
  };

  return (
    <OverlayView
      title={props.title}
      onClose={() => {
        handleOverlayGTMEvents(
          props.title.includes(t("header.selectCrypto")) ||
            props.title.includes(t("selectFiat"))
            ? GtmEventElement.CURRENCY_SEARCH
            : ""
        );
      }}
    >
      <ViewList
        onItemClick={(index, item) => onItemClick(name, index, item)}
        items={props.items}
        searchable={!!props.searchable}
        indexSelected={props.indexSelected}
        onSearchBoxClick={() =>
          handleOverlayGTMEvents(
            props.title.includes(t("header.selectCrypto")) ||
              props.title.includes(t("selectFiat"))
              ? GtmEventElement.CURRENCY_CLOSE
              : ""
          )
        }
      />
    </OverlayView>
  );
};

export default PickView;
