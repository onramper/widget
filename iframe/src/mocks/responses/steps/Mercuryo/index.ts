const getNextStep = (currentStep: string) => {
    switch (currentStep) {
        case "iframe":
            return iframeStep;
    }
}

const iframeStep = {
    type: "redirect",
    url: "https://exchange.mercuryo.io/?widget_id=d9c6c6f9-79a1-49dc-8154-b3b52576f58f&type=buy&fiat_amount=200&currency=BTC&fiat_currency=EUR&merchant_transaction_id=q_s69cdRPbj_UC28Jf6jVg--",
    hint: "Mercuryo's sandbox is not externally available, so we redirect to their live version. Transactions completed there will therefore incur charges."
}

export default {
    getNextStep
}