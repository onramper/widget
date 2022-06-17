export enum GtmEvent {
  FIAT_TO_CRYPTO = "fiat-to-crypto",
  CRYPTO_TO_FIAT = "crypto-to-fiat",
  ELEMENT_CLICK = "element-click",
}

export enum GtmEventAction {
  OUT_CURRENCY_SELECTION = "outCurrencySelection",
  IN_CURRENCY_SELECTION = "inCurrencySelection",
  IN_CURRENCY_SEARCH = "inCurrencySearch",
  OUT_CURRENCY_SEARCH = "outCurrencySearch",
  IN_CURRENCY_CLOSE = "inCurrencyClose",
  OUT_CURRENCY_CLOSE = "outCurrencyClose",
}

export enum GtmEventLabel {
  IN_CURRENCY_SEARCH = "inCurrencySearch",
  OUT_CURRENCY_SEARCH = "outCurrencySearch",
  IN_CURRENCY_CLOSE = "inCurrencyClose",
  OUT_CURRENCY_CLOSE = "outCurrencyClose",
}

export enum GtmEventCategory {
  DROPDOWN_VALUE = "dropdownValue",
  FIELD = "field",
  BUTTON = "button",
}

export enum GtmEventElement {
  CURRENCY_CLOSE = "currencyClose",
  CURRENCY_SEARCH = "currencySearch",
}
