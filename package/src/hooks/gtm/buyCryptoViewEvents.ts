import {
  GtmEvent,
  GtmEventAction,
  GtmEventLabel,
  GtmEventCategory,
} from "../../enums";

export const amountClickGtmEvent = {
  event: GtmEvent.ELEMENT_CLICK,
  action: GtmEventAction.TRANSACTION_FORM,
  category: GtmEventCategory.FIELD,
  label: GtmEventLabel.AMOUNT,
};

export const inCurrencyClickGtmEvent = {
  event: GtmEvent.ELEMENT_CLICK,
  action: GtmEventAction.TRANSACTION_FORM,
  category: GtmEventCategory.DROPDOWN,
  label: GtmEventLabel.IN_CURRENCY,
};

export const outCurrencyClickGtmEvent = {
  event: GtmEvent.ELEMENT_CLICK,
  action: GtmEventAction.TRANSACTION_FORM,
  category: GtmEventCategory.DROPDOWN,
  label: GtmEventLabel.OUT_CURRENCY,
};

export const buyBtnClickGtmEvent = {
  event: GtmEvent.ELEMENT_CLICK,
  action: GtmEventAction.TRANSACTION_FORM,
  category: GtmEventCategory.BUTTON,
  label: GtmEventLabel.BUY,
};

export const buyTabClickGtmEvent = {
  event: GtmEvent.ELEMENT_CLICK,
  action: GtmEventAction.TRANSACTION_FORM,
  category: GtmEventCategory.TAB,
  label: GtmEventLabel.BUY,
};

export const sellTabClickGtmEvent = {
  event: GtmEvent.ELEMENT_CLICK,
  action: GtmEventAction.TRANSACTION_FORM,
  category: GtmEventCategory.TAB,
  label: GtmEventLabel.SELL,
};

export const swapTabClickGtmEvent = {
  event: GtmEvent.ELEMENT_CLICK,
  action: GtmEventAction.TRANSACTION_FORM,
  category: GtmEventCategory.TAB,
  label: GtmEventLabel.SWAP,
};

export const menuBtnClickGtmEvent = {
  event: GtmEvent.ELEMENT_CLICK,
  action: GtmEventAction.TRANSACTION_FORM,
  category: GtmEventCategory.BUTTON,
  label: GtmEventLabel.MENU,
};

export const genPaymentMethodOptionEvent = (paymentMethodId: String) => ({
  event: GtmEvent.ELEMENT_CLICK,
  action: GtmEventAction.TRANSACTION_FORM,
  category: GtmEventCategory.OPTION,
  label: paymentMethodId,
});

export const genPaymentMethodSelectEvent = (id: string) => ({
  event: GtmEvent.ELEMENT_CLICK,
  action: GtmEventAction.PAYMENT_METHOD_SELECTION,
  category: GtmEventCategory.DROPDOWN_VALUE,
  label: id,
});
