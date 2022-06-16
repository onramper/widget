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
}

export enum GtmEventCategory {
  DROPDOWN_VALUE = "dropdownValue",
  BUTTON = "button",
}

export enum GtmEventLabel {
  PAYMENT_METHOD_CLOSE = "paymentMethodClose",
  PAYMENT_METHOD = "paymentMethod",
}

export enum GtmGatewaySelectionType {
  PERFORMANCE = "best",
  PRICE = "price",
  NOT_SUGGESTED = "notSuggested",
}
