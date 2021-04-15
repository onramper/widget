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
  //https://api.mercuryo.io/v1.5/widget/buy/rate?from=USD&to=BTC&amount=100&widget_id=d9d9dab5-7127-417b-92fb-478bc90916b3

  const quoteUrl = `https://api.mercuryo.io/v1.6/widget/buy/rate?from=${fiat}&to=${crypto}&amount=${amount}&widget_id=${widgetId}`;
  logRequest(quoteUrl);
  const ratesRes = await fetch(quoteUrl);
  const rates: QuoteResponse = await processResponse(ratesRes);
  return rates;
};
