import styles from './styles.module.css'
import { BadgeType } from './ChooseGatewayView.models';
import flashIcon from "./../icons/flash.svg";
import percentageIcon from "./../icons/percentage.svg";
import incognitoIcon from "./../icons/incognito.svg";

export const cryptoAmountsWarning = "The displayed amounts are an approximate calculation of the crypto that you will receive after fees.";

export const transitionPropsCollapse = {
    timeout: 200,
    classNames: {
        enter: styles['collapse-enter'],
        enterActive: styles['collapse-enter-active'],
        exit: styles['collapse-exit'],
        exitActive: styles['collapse-exit-active']
    },
    unmountOnExit: true
}

export const badgeItemMap = {
    [BadgeType.Fast]: {
        label: BadgeType.Fast,
        icon: flashIcon
    },
    [BadgeType.Cheapest]: {
        label: BadgeType.Cheapest,
        icon: percentageIcon
    },
    [BadgeType.NoIdRequired]: {
        label: BadgeType.NoIdRequired,
        icon: incognitoIcon
    },
}