import IconBTC from '../icons/btc.svg'
import IconUSD from '../icons/usd.svg'
import IconCC from '../icons/ccs.svg'

const getExpectedCrypto = async (amount: number) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return amount * 0.0001073
}

const getData = async () => {
    return {
        availableCryptos: [
            {
                icon: IconBTC,
                name: "BTC",
                info: "Bitcoin"
            }
        ],
        availableCurrencies: [
            {
                icon: IconUSD,
                name: "USD",
                info: "US Dollar"
            }
        ],
        availablePaymentMethods: [
            {
                icon: IconCC,
                name: "Credit card"
            }
        ]
    }
}

export {
    getExpectedCrypto,
    getData
}