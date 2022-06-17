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
}

export enum GtmGatewaySelectionType {
  PERFORMANCE = "best",
  PRICE = "price",
  NOT_SUGGESTED = "notSuggested",
  FIELD = "field",
  BUTTON = "button",
}

export enum GtmEventElement {
  CURRENCY_CLOSE = "currencyClose",
  CURRENCY_SEARCH = "currencySearch",
}
