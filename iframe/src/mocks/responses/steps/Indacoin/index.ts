const getNextStep = (currentStep: string) => {
    switch (currentStep) {
        case 'iframe':
            return iframeStep
    }
}

const iframeStep = {
    "type": "iframe",
    "url": "https://indacoin.com/partner-widget?partner=onramper1&cur_from=EUR&cur_to=BTC&amount=200&extra_info=%7B%22apiKey%22%3A%22pk_test_oDsXkHokDdr06zZ0_sxJGw00%22%2C%22txId%22%3A%22lM_j8Hfsgu9QpjlzKsmc-w--%22%7D",
    "neededFeatures": "accelerometer; autoplay; camera; gyroscope; payment;",
    "fullscreen": true
}

export default {
    getNextStep
}