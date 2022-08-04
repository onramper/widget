import { BadgeType } from "./ChooseGatewayView.models";
import checkIcon from "./../icons/check-circle.svg";
import percentageIcon from "./../icons/percentage.svg";
import incognitoIcon from "./../icons/incognito.svg";

export const cryptoAmountsWarning =
  "The displayed amounts are an approximate calculation of the crypto that you will receive after fees.";

export const badgeItemMap = {
  [BadgeType.Fast]: {
    label: BadgeType.Fast,
    icon: checkIcon,
  },
  [BadgeType.Cheapest]: {
    label: BadgeType.Cheapest,
    icon: percentageIcon,
  },
  [BadgeType.NoIdRequired]: {
    label: BadgeType.NoIdRequired,
    icon: incognitoIcon,
  },
};
