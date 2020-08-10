import * as API from './'
import { IconGatewaysResponse, GatewaysResponse } from './types/gateways'
import { arrayUnique, arrayObjUnique } from '../../wrappers/utils'

enum ItemCategory {
    Crypto = 'CRYPTO',
    Currency = 'CURRENCY',
    PaymentMethod = 'PAYMENT_METHOD'
}

type AvailableCryptos = GatewaysResponse['gateways'][0]['cryptoCurrencies']

type OnGatewaysCallback = ({ err, availableCryptos }:
    { err?: string, availableCryptos: AvailableCryptos }) => void
type ParamsOnCountryChange = { country?: string, includeIcons?: boolean }

let config = {
    defaultCountry: undefined,
    includeIcons: true
    
}

let collected: {
    selectedCountry?: GatewaysResponse['gateways'][0]['cryptoCurrencies'][0]
} = {
    selectedCountry: config.defaultCountry
}
/* 
const onCountryChange = async (onGateways: OnGatewaysCallback) => {

    // REQUEST AVAILABLE GATEWAYS
    let response_gateways: GatewaysResponse | undefined = undefined
    try {
        response_gateways = await API.gateways({ country: collected.selectedCountry?.code, includeIcons: config.includeIcons })
    } catch (error) {
        onGateways({ err: error.message, availableCryptos: [] })
        return
    }
    if (response_gateways.gateways.length <= 0) {
        onGateways({ err: 'No gateways found.', availableCryptos: [] })
        return
    }

    // GET ALL AVAILABLE CRYPTOS
    let availableCryptos: GatewaysResponse['gateways'][0]['cryptoCurrencies'] = []
    for (var i in response_gateways.gateways) {
        if (!response_gateways.gateways[i].cryptoCurrencies) continue
        availableCryptos = availableCryptos.concat(response_gateways.gateways[i].cryptoCurrencies)
    }
    availableCryptos = arrayObjUnique(availableCryptos, 'code')
    if (availableCryptos.length <= 0) {
        onGateways({ err: 'No cryptos found.', availableCryptos: [] })
        return
    }

    const ICONS_MAP = response_gateways.icons || {}

    if (includeIcons)
        availableCryptos = availableCryptos.map((crypto) => ({
            ...crypto,
            currencyType: ItemCategory.Crypto,
            info: ICONS_MAP[crypto.code]?.name || 'Cryptocurrency',
            icon: ICONS_MAP[crypto.code]?.icon,
        }))
    else
        availableCryptos = availableCryptos.map((crypto) => ({
            ...crypto,
            currencyType: ItemCategory.Crypto
        }))

    onGateways({ availableCryptos: [] })
}
 */

type AvailableCurrencies = GatewaysResponse['gateways'][0]['cryptoCurrencies']

type OnCryptosProcessedCallback = ({ err, availableCurrenices }:
    { err?: string, availableCurrenices: AvailableCurrencies }) => void

type Item = GatewaysResponse['gateways'][0]['cryptoCurrencies'][0]

type ParamsProcessCryptos = { selectedCrypto: Item, response_gateways: GatewaysResponse }
/* 
const processCryptos = async (onGateways: OnCryptosProcessedCallback, { selectedCrypto, response_gateways }: ParamsProcessCryptos) => {

    // REQUEST AVAILABLE GATEWAYS

    try {
        response_gateways = await API.gateways({ country, includeIcons: includeIcons })
    } catch (error) {
        onGateways({ err: error.message, response_gateways, availableCryptos: [] })
        return
    }
    if (response_gateways.gateways.length <= 0) {
        onGateways({ err: 'No gateways found.', response_gateways, availableCryptos: [] })
        return
    }

    // GET ALL AVAILABLE CRYPTOS
    let availableCryptos: GatewaysResponse['gateways'][0]['cryptoCurrencies'] = []
    for (var i in response_gateways.gateways) {
        if (!response_gateways.gateways[i].cryptoCurrencies) continue
        availableCryptos = availableCryptos.concat(response_gateways.gateways[i].cryptoCurrencies)
    }
    availableCryptos = arrayObjUnique(availableCryptos, 'code')
    if (availableCryptos.length <= 0) {
        onGateways({ err: 'No cryptos found.', response_gateways, availableCryptos: [] })
        return
    }

    onGateways({ response_gateways, availableCryptos: [] })
}

export {
    onCountryChange,
    processCryptos
} */

export type {
    AvailableCryptos,
    OnGatewaysCallback
}