export enum GtmEvent {
  FIAT_TO_CRYPTO = "fiat-to-crypto",
  CRYPTO_TO_FIAT = "crypto-to-fiat",
  ELEMENT_CLICK = "element-click",
  GATEWAY_SELECTION = "gateway-selection",
}

export enum GtmEventAction {
  OUT_CURRENCY_SELECTION = "outCurrencySelection",
  IN_CURRENCY_SELECTION = "inCurrencySelection",
  PAYMENT_METHOD_SELECTION = "paymentMethodSelection",
  MANUAL_SELECTION = "manualSelection",
  TRANSACTION_FORM = "transactionForm",
  IN_CURRENCY_SEARCH = "inCurrencySearch",
  OUT_CURRENCY_SEARCH = "outCurrencySearch",
  IN_CURRENCY_CLOSE = "inCurrencyClose",
  OUT_CURRENCY_CLOSE = "outCurrencyClose",
  CURRENCY_CLOSE = "currencyClose",
  CURRENCY_SEARCH = "currencySearch",
  FAQ_MENU_LINK = "faqMenuLink",
  PRIVACY_POLICY_MENU_LINK = "privacyPolicyMenuLink",
  TERMS_OF_USAGE_MENU_LINK = "termsOfUsageMunuLink",
  MOONPAY_SUPPORT_LINK = "moonPaySupportMenuLink",
  UNISWAP_SUPPORT_MENU_LINK = "uniswapSupportMenuLink",
  MENU_CLOSE = "menuClose",
}

export enum GtmEventCategory {
  DROPDOWN_VALUE = "dropdownValue",
  BUTTON = "button",
  FIELD = "field",
  DROPDOWN = "dropdown",
  TAB = "tab",
  OPTION = "option",
}

export enum GtmEventLabel {
  IN_CURRENCY_SEARCH = "inCurrencySearch",
  OUT_CURRENCY_SEARCH = "outCurrencySearch",
  IN_CURRENCY_CLOSE = "inCurrencyClose",
  OUT_CURRENCY_CLOSE = "outCurrencyClose",
  PAYMENT_METHOD_CLOSE = "paymentMethodClose",
  PAYMENT_METHOD = "paymentMethod",
  IN_CURRENCY = "inCurrency",
  OUT_CURRENCY = "outCurrency",
  BUY = "buy",
  SELL = "sell",
  MENU = "menu",
  AMOUNT = "amount",
  MENU_CLOSE = "menuClose",
}

export enum GtmGatewaySelectionType {
  PERFORMANCE = "best",
  PRICE = "price",
  NOT_SUGGESTED = "notSuggested",
  FIELD = "field",
  BUTTON = "button",
  LINK = "link",
}

export enum MenuItem {
  "faq" = GtmEventAction.FAQ_MENU_LINK,
  "privacy-policy" = GtmEventAction.PRIVACY_POLICY_MENU_LINK,
  "terms" = GtmEventAction.TERMS_OF_USAGE_MENU_LINK,
  "support-moonpay" = GtmEventAction.MOONPAY_SUPPORT_LINK,
  "support-uniswap" = GtmEventAction.UNISWAP_SUPPORT_MENU_LINK,
}
