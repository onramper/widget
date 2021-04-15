import { logRequest, processResponse } from "../../index";

const widgetId = "6c273bc8-ca1d-4d7b-99e3-0d451befd932";

interface QuoteResponse {
  status: number;
  data: {
    amount: number;
  };
}

export const getQuote = async (
  fiat: string,
  crypto: string,
  amount: number
) => {
  const quoteUrl = `https://api.mercuryo.io/v1.5/widget/buy/rate?from=${fiat}&to=${crypto}&amount=${amount}&widget_id=${widgetId}`;
  logRequest(quoteUrl);
  const ratesRes = await fetch(quoteUrl);
  const rates: QuoteResponse = await processResponse(ratesRes);
  return rates;
};
