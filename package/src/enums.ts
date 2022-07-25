export enum GtmEvent {
  FIAT_TO_CRYPTO = "fiat-to-crypto",
  CRYPTO_TO_FIAT = "crypto-to-fiat",
  ELEMENT_CLICK = "element-click",
  GATEWAY_SELECTION = "gateway-selection",
  EXPERIMENT = "experiment",
  FIELD_ERROR = "fieldError",
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
  MENU = "menu",
  MENU_CLOSE = "menuClose",
  WALLET_FORM = "walletForm",
  EMAIL_FORM = "emailForm",
}

export enum GtmEventCategory {
  DROPDOWN_VALUE = "dropdownValue",
  FIELD = "field",
  BUTTON = "button",
  LINK = "link",
  DROPDOWN = "dropdown",
  TAB = "tab",
  OPTION = "option",
  VARIANT_A = "variantA",
  CONTROL = "control",
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
  CONTINUE = "continue",
  EMAIL_ADDRESS = "emailAddress",
  WALLET_ADDRESS = "walletAddress",
  PASSWORD = "password",
  MENU_FAQ = "faq",
  MENU_PRIVACY_POLICY = "privacyPolicy",
  MENU_TERMS = "termsOfUsage",
  MENU_HELP = "help",
  MENU_MOONPAY_SUPPORT = "moonPaySupport",
  MENU_UNISWAP_SUPPORT = "uniswapSupport",
  MENU_BTCDIRECT_SUPPORT = "btcDirectSupport",
  MENU_COINIFY_SUPPORT = "coinifySupport",
  MENU_INDACOIN_SUPPORT = "indacoinSupport",
  MENU_MERCURYO_SUPPORT = "mercuryoSupport",
  MENU_UTORG_SUPPORT = "utorgSupport",
  MENU_WYRE_SUPPORT = "wyreSupport",
  MENU_XANPOOL_SUPPORT = "xanpoolSupport",
  AMOUNT_SWITCH="amountSwitch",
  STATIC_ROUTING_EXPERIMENT = "staticRoutingExperiment",
}

export enum GtmGatewaySelectionType {
  PERFORMANCE = "best",
  PRICE = "price",
  NOT_SUGGESTED = "notSuggested",
}

export enum MenuItemLabel {
  "faq" = GtmEventLabel.MENU_FAQ,
  "privacy-policy" = GtmEventLabel.MENU_PRIVACY_POLICY,
  "terms" = GtmEventLabel.MENU_TERMS,
  "support-moonpay" = GtmEventLabel.MENU_MOONPAY_SUPPORT,
  "support-uniswap" = GtmEventLabel.MENU_UNISWAP_SUPPORT,
  "support-btcdirect" = GtmEventLabel.MENU_BTCDIRECT_SUPPORT,
  "support-coinify" = GtmEventLabel.MENU_COINIFY_SUPPORT,
  "support-indacoin" = GtmEventLabel.MENU_INDACOIN_SUPPORT,
  "support-mercuryo" = GtmEventLabel.MENU_MERCURYO_SUPPORT,
  "support-utorg" = GtmEventLabel.MENU_UTORG_SUPPORT,
  "support-wyre" = GtmEventLabel.MENU_WYRE_SUPPORT,
  "support-xanpool" = GtmEventLabel.MENU_XANPOOL_SUPPORT,
  "help" = GtmEventLabel.MENU_HELP,
}

export enum FormTitle {
  EMAIL_FORM = "emailForm",
  WALLET_FORM = "walletForm",
}

export enum FormName {
  "Input your email" = FormTitle.EMAIL_FORM,
  "Your BTC address" = FormTitle.WALLET_FORM,
  "Purchase form" = FormTitle.EMAIL_FORM,
}