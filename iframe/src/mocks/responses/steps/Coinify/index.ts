const getNextStep = (currentStep: string) => {
    switch (currentStep) {
        case 'iframe':
            return iframeStep
    }
}

const iframeStep = {
    "type": "iframe",
    "neededFeatures": "accelerometer; autoplay; camera; gyroscope; payment;",
    "url": "https://trade-ui.coinify.com/?partnerId=aa8a6b04-8c19-491f-8459-eaba81b7fdd6&cryptoCurrencies=BTC&fiatCurrency=EUR&defaultFiatCurrency=EUR&buyAmount=191&transferInMedia=card&targetPage=buy&transferOutMedia=blockchain&partnerContext=%7B%22txId%22%3A%22piE2jqxqBbUTboPPdGeozg--%22%7D",
    "fullscreen": true
}

export default {
    getNextStep
}