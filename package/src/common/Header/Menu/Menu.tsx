import React from "react";
import { useTranslation } from "react-i18next";
import ListItemButtonGroup from "../../ListItemButtonGroup/ListItemButtonGroup";
import OverlayMenu from "../../OverlayMeu/OverlayMenu";
import menuItems from "./menuItems";
import classes from "./Menu.module.css";
import { ListItemType } from "../../ListItemButtonGroup/ListItemButtonGroup.models";
import { useGTMDispatch } from "../../../hooks/gtm";
import {
  GtmEvent,
  GtmEventAction,
  GtmEventCategory,
  GtmEventLabel,
} from "../../../enums";

const Menu: React.FC<{ className?: string }> = (props) => {
  const { t } = useTranslation();
  const sendDataToGTM = useGTMDispatch();

  const handleSendMenuDataToGTM = (item: ListItemType) => {
    console.log(item);
    let action;
    switch (item.id) {
      case "faq":
        action = GtmEventAction.FAQ_MENU_LINK;
        break;
      case "privacy-policy":
        action = GtmEventAction.PRIVACY_POLICY_MENU_LINK;
        break;
      case "terms":
        action = GtmEventAction.TERMS_OF_USAGE_MENU_LINK;
        break;
      case "support-moonpay":
        action = GtmEventAction.MOONPAY_SUPPORT_LINK;
        break;
      case "support-uniswap":
        action = GtmEventAction.UNISWAP_SUPPORT_MENU_LINK;
        break;
      default:
        break;
    }
    const gtmData = {
      event: GtmEvent.ELEMENT_CLICK,
      action,
      category: GtmEventCategory.LINK,
      label: item.id,
    };

    sendDataToGTM(gtmData);
  };

  const handleSendMenuCloseToGTM = () => {
    const gtmData = {
      event: GtmEvent.ELEMENT_CLICK,
      action: GtmEventAction.MENU_CLOSE,
      category: GtmEventCategory.LINK,
      label: GtmEventLabel.MENU_CLOSE,
    };
    sendDataToGTM(gtmData);
  };

  return (
    <OverlayMenu
      headerProps={{
        title: t("menu.title"),
        className: props.className,
      }}
      onClose={handleSendMenuCloseToGTM}
    >
      <ListItemButtonGroup
        className={classes["menu-list"]}
        items={menuItems}
        onClick={handleSendMenuDataToGTM}
      />
    </OverlayMenu>
  );
};

export default Menu;
