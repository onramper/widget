import faqIcon from "./../../../icons/menu/faq.svg";
import privacyIcon from "./../../../icons/menu/privacy.svg";
import helpIcon from "./../../../icons/menu/help.svg";
import termsIcon from "./../../../icons/menu/terms.svg";
import moonPayIcon from "./../../../icons/menu/moonpay.svg";
import uniswapIcon from "./../../../icons/menu/uniswap.svg";
import btcDirectIcon from "./../../../icons/menu/btcdirect.svg";
import indacoinIcon from "./../../../icons/menu/indacoin.svg";
import coinifyIcon from "./../../../icons/menu/coinify.svg";
import xanpoolIcon from "./../../../icons/menu/xanpool.svg";
import wyreIcon from "./../../../icons/menu/wyre.svg";
import utorgIcon from "./../../../icons/menu/utorg.svg";
import mercuryoIcon from "./../../../icons/menu/mercuryo.svg";
import { ListItemType } from "../../ListItemButtonGroup/ListItemButtonGroup.models";

const menuItems: ListItemType[] = [
  {
    id: "faq",
    text: "menu.menuItems.faq",
    icon: faqIcon,
    link: "https://onramper.com/FAQ",
  },
  {
    id: "privacy-policy",
    text: "menu.menuItems.privacyPolicy",
    icon: privacyIcon,
    link: "https://onramper.com/privacy-policy",
  },
  {
    id: "terms",
    text: "menu.menuItems.terms",
    icon: termsIcon,
    link: "https://onramper.com/terms-of-use/",
  },
  {
    id: "help",
    text: "menu.menuItems.help",
    icon: helpIcon,
    items: [
      {
        id: "support-uniswap",
        text: "menu.menuItems.support.uniswap",
        icon: uniswapIcon,
        link: "https://help.uniswap.org/en/",
      },
      {
        id: "support-moonpay",
        text: "menu.menuItems.support.moonpay",
        icon: moonPayIcon,
        link: "https://support.moonpay.com/hc/en-gb",
      },
      {
        id: "support-btcdirect",
        text: "menu.menuItems.support.btcdirect",
        icon: btcDirectIcon,
        link: "https://support.btcdirect.eu/hc/en-gb",
      },
      {
        id: "support-coinify",
        text: "menu.menuItems.support.coinify",
        icon: coinifyIcon,
        link: "https://help.coinify.com/hc/en-us/categories/360002499620-Buying-and-selling-cryptocurrency",
      },
      {
        id: "support-indacoin",
        text: "menu.menuItems.support.indacoin",
        icon: indacoinIcon,
        link: "https://indacoin.com/faq",
      },
      {
        id: "support-mercuryo",
        text: "menu.menuItems.support.mercuryo",
        icon: mercuryoIcon,
        link: "https://help.mercuryo.io/en/articles/4519473-mercuryo-widget-faq",
      },
      {
        id: "support-utorg",
        text: "menu.menuItems.support.utorg",
        icon: utorgIcon,
        link: "https://utorg.pro/faq/",
      },
      {
        id: "support-wyre",
        text: "menu.menuItems.support.wyre",
        icon: wyreIcon,
        link: "https://support.sendwyre.com/hc/en-us",
      },
      {
        id: "support-xanpool",
        text: "menu.menuItems.support.xanpool",
        icon: xanpoolIcon,
        link: "https://support.xanpool.com/hc/en-us",
      },
    ],
  },
];

export default menuItems;
