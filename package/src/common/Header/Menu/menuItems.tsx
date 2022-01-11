import faqIcon from "./../../../icons/menu/faq.svg";
import privacyIcon from "./../../../icons/menu/privacy.svg";
import helpIcon from "./../../../icons/menu/help.svg";
import termsIcon from "./../../../icons/menu/terms.svg";
import moonPayIcon from "./../../../icons/menu/moonpay.svg";
import uniswapIcon from "./../../../icons/menu/uniswap.svg";
import { ListItemType } from "../../ListItemButtonGroup/ListItemButtonGroup.models";

const menuItems:ListItemType[] = [
  {
    id: "faq",
    text: "FAQ",
    icon: faqIcon,
    link: "https://onramper.com/FAQ",
  },
  {
    id: "privacy-policy",
    text: "Privacy Policy",
    icon: privacyIcon,
    link: "https://onramper.com/privacy-policy"
  },
  {
    id: "terms",
    text: "Terms of Usage",
    icon: termsIcon,
    link: "https://onramper.com/terms-of-use/"
  },
  {
    id: "help",
    text: "Help & Support",
    icon: helpIcon,
    items: [
      {
        id: "support-moonpay",
        text: "MoonPay Support",
        icon: moonPayIcon,
        link: "https://support.moonpay.com/hc/en-gb"
      },
      {
        id: "support-uniswap",
        text: "Uniswap Support",
        icon: uniswapIcon,
        link: "https://help.uniswap.org/en/"
      },
    ],
  },
];

export default menuItems;
