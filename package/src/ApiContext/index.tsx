import React, { createContext, useReducer, useCallback, useEffect, useState } from 'react';

import { StateType, initialState, ItemCategory } from './initialState'
import { mainReducer, CollectedActionsType, DataActionsType } from './reducers'

import { arrayUnique, arrayObjUnique } from '../utils'

import LogoOnramper from '../icons/onramper_logo.svg'

import * as API from './api'
import type { ItemType, GatewayRateOption, ErrorObjectType, TypesOfRateError, CryptoAddrType, CollectedStateType, GatewayRateOptionSimple } from './initialState';
import { GatewaysResponse } from './api/types/gateways'
import { RateResponse } from './api/types/rate'
import type { NextStep, StepDataItems, FileStep, InfoDepositBankAccount } from './api/types/nextStep';

import { NextStepError } from './api'
import type { Filters } from './api'

import phoneCodes from './utils/phoneCodes'

const BASE_DEFAULT_AMOUNT_IN_USD = 100
const DEFAULT_CURRENCY = 'USD'
const DEFAULT_CRYPTO = 'BTC'
export const DEFAULT_COUNTRY = 'US'
export const DEFAULT_STATE = 'AL'

//Creating context
const APIContext = createContext<StateType>(initialState);

interface APIProviderType {
  API_KEY?: string,
  defaultAmount?: number
  defaultAddrs?: { [denom: string]: CryptoAddrType }
  defaultCrypto?: string
  defaultFiat?: string
  defaultFiatSoft?: string
  defaultPaymentMethod?: string
  filters?: Filters
  country?: string
  isAddressEditable?: boolean
}

const APIProvider: React.FC<APIProviderType> = (props) => {
  const { defaultAmount = 100, defaultAddrs = {}, API_KEY, isAddressEditable = true } = props
  const defaultFiat = props.defaultFiat?.toUpperCase()
  const defaultFiatSoft = props.defaultFiatSoft?.toUpperCase() || DEFAULT_CURRENCY
  const defaultCrypto = props.defaultCrypto?.toUpperCase() || DEFAULT_CRYPTO
  const iniState = {
    ...initialState,
    collected: {
      ...initialState.collected,
      amount: defaultAmount < 0 ? initialState.collected.amount : defaultAmount,
      defaultAddrs: Object.entries(defaultAddrs).reduce((acc, [key, value]) => ({ ...acc, [key.toUpperCase()]: value }), {}),
      isAddressEditable
    }
  }
  const [state, dispatch] = useReducer(mainReducer, iniState);
  const [lastCall, setLastCall] = useState<AbortController>();

  // INITIALIZING AUTHENTICATION
  useEffect(() => {
    if (!API_KEY) throw new Error("API KEY NOT PROVIDED")
    API.authenticate(API_KEY)
  }, [API_KEY])

  /* DEFINING INPUT INTERFACES */
  const handleInputChange = useCallback(
    (name: string, value: string | number | boolean | ItemType | ErrorObjectType[] | { [key: string]: string; }) => dispatch({ type: CollectedActionsType.AddField, payload: { name, value } }),
    []
  )

  useEffect(()=>{
    handleInputChange("isAddressEditable", isAddressEditable)
  }, [isAddressEditable, handleInputChange])

  useEffect(() => {
    if (lastCall) handleInputChange('isCalculatingAmount', true)
    else handleInputChange('isCalculatingAmount', state.data.responseRate === undefined)
  }, [lastCall, handleInputChange, state.data.responseRate])


  /* *********** */

  const addData = useCallback(
    (data: any) => dispatch({ type: DataActionsType.AddData, payload: { value: data } }),
    []
  )

  const processErrors = useCallback((newError: ErrorObjectType) => {
    dispatch({ type: CollectedActionsType.AddError, payload: { value: newError } })
    return newError
  }, [])

  const clearErrors = useCallback(() => {
    dispatch({ type: CollectedActionsType.AddError, payload: { value: undefined } })
  }, [])

  /* *********** */
  const init = useCallback(
    async (country?: string): Promise<ErrorObjectType | undefined | {}> => {
      const actualCountry = props.country || country
      // REQUEST AVAILABLE GATEWAYS
      let rawResponseGateways: GatewaysResponse
      let responseGateways: GatewaysResponse
      try {
        clearErrors()
        rawResponseGateways = await API.gateways({ country: actualCountry, includeIcons: true, includeDefaultAmounts: true })
        responseGateways = API.filterGatewaysResponse(rawResponseGateways, props.filters)
      } catch (error) {
        return processErrors({
          GATEWAYS: {
            type: "API",
            message: error.message
          }
        })
      }
      handleInputChange('selectedCountry', actualCountry || responseGateways.localization.country || DEFAULT_COUNTRY)
      if (responseGateways.gateways.length <= 0) {
        if (rawResponseGateways.gateways.length > 0) {
          return processErrors({
            GATEWAYS: {
              type: "DISABLED_GATEWAYS",
              message: "Gateways disabled by filters."
            }
          })
        }
        return processErrors({
          GATEWAYS: {
            type: "NO_GATEWAYS",
            message: "No gateways found."
          }
        })
      }

      const ICONS_MAP = responseGateways.icons || {}

      // GET ALL AVAILABLE CRYPTOS
      let availableCryptos: GatewaysResponse['gateways'][0]['cryptoCurrencies'] = []
      for (const i in responseGateways.gateways) {
        if (!responseGateways.gateways[i].cryptoCurrencies) continue
        availableCryptos = availableCryptos.concat(responseGateways.gateways[i].cryptoCurrencies)
      }
      availableCryptos = arrayObjUnique(availableCryptos, 'code')
      if (availableCryptos.length <= 0) {
        return processErrors({
          GATEWAYS: {
            type: "NO_ITEMS",
            message: "No cryptos found."
          }
        })
      }

      // MAP AVAILABLE CRYPTOS LIST (CURRENCY LIST) TO AN ITEMTYPE LIST
      const mappedAvailableCryptos: ItemType[] = availableCryptos.map((crypto) => ({
        id: crypto.code,
        name: crypto.code,
        info: ICONS_MAP[crypto.code]?.name || 'Cryptocurrency',
        icon: ICONS_MAP[crypto.code]?.icon,
        precision: crypto.precision,
        symbol: crypto.code,
        currencyType: ItemCategory.Crypto
      }))

      // save to state.collected
      handleInputChange('state', responseGateways.localization.state ?? DEFAULT_STATE)
      handleInputChange("phoneCountryCode", +phoneCodes[responseGateways.localization.country?.toUpperCase() ?? DEFAULT_COUNTRY]?.phoneCode)
      // save to state.date
      addData({
        availableCryptos: mappedAvailableCryptos,
        ICONS_MAP,
        responseGateways: responseGateways
      })

    }, [addData, handleInputChange, props.filters, processErrors, clearErrors, props.country])

  const handleCryptoChange = useCallback(
    (crypto?: ItemType): ErrorObjectType | undefined | {} => {
      let _crypto: typeof crypto
      if (!crypto)
        _crypto = state.collected.selectedCrypto || { id:defaultCrypto, name:defaultCrypto }
      else
        _crypto = crypto

      // IF RESPONSE IS NOT SET YET, DON'T DO ANYTHING
      if (!state.data.responseGateways) return {}
      const gateways = state.data.responseGateways.gateways

      if (gateways.length <= 0) return {}
      if (state.data.availableCryptos.length <= 0) return {}

      const actualCrypto = state.data.availableCryptos.find((cryptoCurrency) => cryptoCurrency.id === _crypto?.id) || state.data.availableCryptos[0]

      // FILTER POSIBLE GATEWAYS BY SELECTED CRYPTO
      const filtredGatewaysByCrypto = gateways.filter((item) => item.cryptoCurrencies.some((crypto) => crypto.code === actualCrypto.id))

      // GET ALL AVAILABLE FIAT CURRENCIES THAT CAN BE USED TO BUY THE SELECTED CRYPTO
      let availableCurrencies: GatewaysResponse['gateways'][0]['fiatCurrencies'] = []
      for (const i in filtredGatewaysByCrypto) {
        if (!filtredGatewaysByCrypto[i].fiatCurrencies) continue
        availableCurrencies = availableCurrencies.concat(filtredGatewaysByCrypto[i].fiatCurrencies)
      }
      availableCurrencies = arrayObjUnique(availableCurrencies, 'code')
      if (availableCurrencies.length <= 0) {
        return processErrors({
          GATEWAYS: {
            type: "NO_ITEMS",
            message: "No fiat currencies found."
          }
        })
      }

      // MAP AVAILABLE FIAT CURRENCIES (CURRENCY LIST) TO AN ITEMTYPE LIST
      const ICONS_MAP = state.data.responseGateways.icons || {}
      const mappedAvailableCurrencies: ItemType[] = availableCurrencies.map((currency) => ({
        id: currency.code,
        name: currency.code,
        info: ICONS_MAP[currency.code]?.name || 'Currency',
        icon: ICONS_MAP[currency.code]?.icon,
        precision: currency.precision,
        symbol: ICONS_MAP[currency.code]?.symbol,
        currencyType: ItemCategory.Currency
      }))

      // save to state.collected
      handleInputChange('selectedCrypto', actualCrypto)
      // save to state.date
      addData({ availableCurrencies: mappedAvailableCurrencies, filtredGatewaysByCrypto })

    }, [state.data.responseGateways, state.data.availableCryptos, addData, handleInputChange, state.collected.selectedCrypto, processErrors, defaultCrypto]
  )

  const handleCurrencyChange = useCallback(
    (selectedCurrency?: ItemType): ErrorObjectType | undefined | {} => {
      let _selectedCurrency: typeof selectedCurrency

      if (!selectedCurrency)
        _selectedCurrency = state.collected.selectedCurrency || (defaultFiat ? {id:defaultFiat, name:defaultFiat} : undefined)
      else
        _selectedCurrency = selectedCurrency

      // IF RESPONSE IS NOT SET, DON'T DO ANYTHING
      const responseGateways = state.data.responseGateways
      if (!responseGateways) return {}

      // IF LIST IS EMPTY, DON'T DO ANYTHING
      const filtredGatewaysByCrypto = state.data.filtredGatewaysByCrypto
      if (!filtredGatewaysByCrypto || filtredGatewaysByCrypto.length <= 0) return {}
      if (!state.data.availableCurrencies || state.data.availableCurrencies.length <= 0) return {}

      const actualCurrency =
        state.data.availableCurrencies.find((currency) => currency.id === _selectedCurrency?.id)
        || state.data.availableCurrencies.find((currency) => currency.id === responseGateways.localization.currency)
        || state.data.availableCurrencies.find((currency) => currency.id === defaultFiatSoft)
        || state.data.availableCurrencies[0]

      if (!state.collected.selectedCurrency) {
        const DEFAULT_AMOUNTS_MAP = responseGateways.defaultAmounts ?? {}
        const defaultLocalCurrencyAmount = DEFAULT_AMOUNTS_MAP[actualCurrency.id] ?? 200
        const calculatedDefaultAmount = defaultLocalCurrencyAmount * defaultAmount / BASE_DEFAULT_AMOUNT_IN_USD
        handleInputChange('amount', calculatedDefaultAmount)
      }

      // FILTER POSIBLE GATEWAYS BY SELECTED CURRENCY
      const filtredGatewaysByCurrency = filtredGatewaysByCrypto.filter((item) => item.fiatCurrencies.some((currency) => currency.code === actualCurrency.id))

      // GET ALL AVAILABLE PAYMENT METHODS THAT CAN BE USED TO BUY THE SELECTED CRYPTO WITH THE SELECTED CURRENCY
      let availablePaymentMethods: GatewaysResponse['gateways'][0]['paymentMethods'] = []
      for (const i in filtredGatewaysByCurrency) {
        if (!filtredGatewaysByCurrency[i].paymentMethods) continue
        availablePaymentMethods = availablePaymentMethods.concat(filtredGatewaysByCurrency[i].paymentMethods)
      }
      availablePaymentMethods = arrayUnique(availablePaymentMethods)
      if (availablePaymentMethods.length <= 0) {
        return processErrors({
          GATEWAYS: {
            type: "NO_ITEMS",
            message: "No payment methods availables found."
          }
        })
      }

      // MAP AVAILABLE FIAT CURRENCIES (CURRENCY LIST) TO AN ITEMTYPE LIST
      const ICONS_MAP = responseGateways.icons || {}
      const mappedAvailablePaymentMethods: ItemType[] = availablePaymentMethods.map((item) => ({
        id: item,
        name: ICONS_MAP[item]?.name || item,
        symbol: '',
        info: '',
        icon: ICONS_MAP[item]?.icon,
        type: ItemCategory.PaymentMethod
      }))

      // save to state.collected
      handleInputChange('selectedCurrency', actualCurrency)
      // save to state.date
      addData({ availablePaymentMethods: mappedAvailablePaymentMethods, filtredGatewaysByCurrency })

    }, [processErrors, handleInputChange, addData, state.data.filtredGatewaysByCrypto, state.data.availableCurrencies, state.data.responseGateways, state.collected.selectedCurrency, defaultAmount, defaultFiat, defaultFiatSoft]
  )

  const handlePaymentMethodChange = useCallback(
    (selectedPaymentMethod?: ItemType): ErrorObjectType | undefined | {} => {

      let _selectedPaymentMethod: typeof selectedPaymentMethod
      if (!selectedPaymentMethod)
        _selectedPaymentMethod = state.collected.selectedPaymentMethod || (props.defaultPaymentMethod ? { id:props.defaultPaymentMethod, name:props.defaultPaymentMethod } : undefined)
      else
        _selectedPaymentMethod = selectedPaymentMethod

      // IF RESPONSE IS NOT SET, DON'T DO ANYTHING
      if (!state.data.responseGateways) return {}
      if (!state.data.availablePaymentMethods || state.data.availablePaymentMethods.length <= 0) return {}

      const actualPaymentMethod = state.data.availablePaymentMethods.find((currency) => currency.id === _selectedPaymentMethod?.id) || state.data.availablePaymentMethods[0]

      // save to state.collected
      handleInputChange('selectedPaymentMethod', actualPaymentMethod)

    }, [handleInputChange, state.data.availablePaymentMethods, state.data.responseGateways, state.collected.selectedPaymentMethod, props.defaultPaymentMethod])

  const getRates = useCallback(
    async (): Promise<ErrorObjectType | undefined | {}> => {
      // IF RESPONSE IS NOT SET, DON'T DO ANYTHING
      if (!state.data.responseGateways) return

      // IF THE AMOUNT IS NOT SET OR IT'S ===0 THEN NO AVAILABLE RATES
      if (!state.collected.amount || !isFinite(state.collected.amount)) {
        clearErrors()
        addData({ allRates: [] })
        return
      }

      // CHECK IF REQUEST PARAMETERS ARE SET
      const actualAmount = state.collected.amount
      const inCurrency = state.collected.selectedCurrency?.id
      const outCurrency = state.collected.selectedCrypto?.id
      const actualPaymentMethod = state.collected.selectedPaymentMethod?.id
      if (!inCurrency || !outCurrency || !actualPaymentMethod) return

      // CREATE NEW ABORT CONTROLLER FOR EACH REQUEST AND STORE IT IN THE LOCAL STATE
      // IF THERE'S ANY PENDING REQUEST THEN ABORT IT BEFORE STORE THE NEW ABORT CONTROLLER
      const controller = new AbortController()
      const { signal } = controller;

      setLastCall(lastController => {
        lastController?.abort();
        return controller
      })

      // QUERY AVAILABLE RATES
      // IF THE CATCHED EXCEPTION WAS THROWN BY OUR ABORT CONTROLLER THEN RETURN EMPTY ERROR
      // ELSE, CLEAR THE ABORT CONTROLLER AND RETURN ERROR
      let responseRate: RateResponse
      let rawResponseRate: RateResponse
      try {
        clearErrors()
        const address = state.collected.defaultAddrs[outCurrency]?.address
        rawResponseRate = await API.rate(
          inCurrency,
          outCurrency,
          actualAmount,
          actualPaymentMethod,
          {
            country: state.collected.selectedCountry,
            amountInCrypto: state.collected.amountInCrypto,
            includeIcons: true,
            address
          },
          signal
        )
        responseRate = API.filterRatesResponse(rawResponseRate, props.filters?.onlyGateways, state.collected.defaultAddrs, state.collected.selectedCrypto?.id)
      } catch (error) {
        if (error.name === 'AbortError')
          return {}
        setLastCall(undefined)
        return processErrors({
          RATE: {
            type: "API",
            message: error.message
          }
        })
      }

      // IF THE REQUEST DIDN'T THROW ANY ERROR, CLEAR THE ABORT CONTROLLER FROM THE STATE
      setLastCall(undefined)

      if (!responseRate || responseRate.length <= 0) {
        return processErrors({
          RATE: {
            type: "NO_RATES",
            message: "No rates found."
          }
        })
      }

      // MAP RATES TO GatewayOptionType
      const mappedAllRates: GatewayRateOption[] = responseRate.map((item) => ({
        id: item.identifier,
        name: item.identifier,
        identifier: item.identifier,
        duration: item.duration,
        available: item.available,
        rate: item.rate,
        fees: item.fees,
        requiredKYC: item.requiredKYC,
        receivedCrypto: item.receivedCrypto,
        nextStep: item.nextStep,
        error: item.error,
        icon: item.icon || LogoOnramper
      }))

      // save to state.date
      addData({ allRates: mappedAllRates, responseRate: responseRate })

      // IF THERE ARE NO RATES AVAILABLES THEN REDUCE UNAVAILABLE RATES TO AN ERRORS OBJECT
      const unavailableRates = responseRate.filter(item => !item.available)
      if (responseRate.length - unavailableRates.length <= 0) {
        const minMaxErrors = unavailableRates.reduce((minMaxErrors: { [key: string]: any }, item) => {
          if (!item.error) return minMaxErrors
          switch (item.error.type) {
            case 'MIN':
              if (!minMaxErrors['MIN'] || ((item.error.limit ?? Number.POSITIVE_INFINITY) < minMaxErrors[item.error.type].limit)) {
                minMaxErrors[item.error.type] = { message: item.error.message, limit: item.error.limit }
              }
              return minMaxErrors
            case 'MAX':
              if (!minMaxErrors[item.error.type] || ((item.error.limit ?? Number.NEGATIVE_INFINITY) > minMaxErrors[item.error.type].limit)) {
                minMaxErrors[item.error.type] = { message: item.error.message, limit: item.error.limit }
              }
              return minMaxErrors
            default:
              //minMaxErrors[item.error.type] = item.error.message
              //minMaxErrors["OTHER"] = item.error.message
              return minMaxErrors
          }
        }, {})

        let errNAME: TypesOfRateError = "MIN"
        //only send 1 error with the following priority
        if (minMaxErrors.MIN)
          errNAME = "MIN"
        else if (minMaxErrors.MAX)
          errNAME = "MAX"
        else {
          return processErrors({
            RATE: {
              type: "ALL_UNAVAILABLE",
              message: "No gateways connected at this moment, please, try again in some minutes."
            }
          })
        }


        return processErrors({
          RATE: {
            type: errNAME,
            message: minMaxErrors[errNAME]?.message,
            limit: minMaxErrors[errNAME]?.limit
          }
        })
      }

      // IF NO ERRORS, RETURN UNDEFINED
      return undefined
    }, [addData, state.collected.selectedCountry, state.collected.selectedCrypto, state.collected.selectedCurrency, state.collected.amount, state.collected.amountInCrypto, state.data.responseGateways, state.collected.selectedPaymentMethod, state.collected.defaultAddrs, processErrors, clearErrors, props.filters?.onlyGateways])

  useEffect(() => {
    handleCryptoChange()
  }, [handleCryptoChange])

  useEffect(() => {
    handleCurrencyChange()
  }, [handleCurrencyChange])

  useEffect(() => {
    handlePaymentMethodChange()
  }, [handlePaymentMethodChange])

  useEffect(()=> {
    const allRatesNames = state.data.allRates.map(rate=>rate.identifier)
    const hiddenRates = state.data.responseGateways?.gateways.filter(gateway=>!allRatesNames.includes(gateway.identifier))
    const hiddenRatesWithMyCrypto = hiddenRates?.filter(rate=>rate.cryptoCurrencies.some(crypto=>crypto.code===state.collected.selectedCrypto?.id))
    const hiddenRatesWithMyCryptonCurrency = hiddenRatesWithMyCrypto?.filter(rate=>rate.fiatCurrencies.some(Fiat=>Fiat.code===state.collected.selectedCurrency?.id))
    const hiddenPaymentMethodsByCryptoFiat = hiddenRatesWithMyCryptonCurrency?.reduce((acc, rate)=> {
      const newAcc = []
      for (let index = 0; index < rate.paymentMethods.length; index++) {
        const element = rate.paymentMethods[index];
        if (!acc[rate.identifier]?.includes(element))
          newAcc.push(element)
      }
      return {
        ...acc,
        [rate.identifier] : [...(acc[rate.identifier]??[]), ...newAcc]
      }
    }, {} as {[identifier:string]:string[]})

    const hiddenPaymentMethodsByCrypto = hiddenRatesWithMyCrypto?.reduce((acc, rate)=> {
      const newAcc = []
      for (let index = 0; index < rate.paymentMethods.length; index++) {
        const element = rate.paymentMethods[index];
        if (!acc[rate.identifier]?.includes(element))
          newAcc.push(element)
      }
      return {
        ...acc,
        [rate.identifier] : [...(acc[rate.identifier]??[]), ...newAcc]
      }
    }, {} as {[identifier:string]:string[]})

    const mappedHiddenByCrypto = Object.entries(hiddenPaymentMethodsByCrypto??{})
    .map(([identifier])=>{
      return {
        identifier: identifier,
        icon: state.data.ICONS_MAP?.[identifier]?.icon || LogoOnramper,
        error: {
          type: "OPTION",
          message: "Available paying with USD, EUR, GBP or other currency"
        }
      }
    })

    const mappedHiddenByFiat = Object.entries(hiddenPaymentMethodsByCryptoFiat??{})
    .map(([identifier, payments])=>{
      return {
        identifier: identifier,
        icon: state.data.ICONS_MAP?.[identifier]?.icon || LogoOnramper,
        error: {
          type: "OPTION",
          message: payments.reduce((acc, payment, index, arr) => {
            const paymentName = state.data.ICONS_MAP?.[payment].name
            if (acc==="")
              return `Available paying with ${paymentName}`
            else if (index<arr.length-1)
              return `${acc}, ${paymentName}`
            else if (index===arr.length-1)
              return `${acc} or ${paymentName}`
            else return acc
          }, "")
        }
      }
    })

    const allMappedHidden = arrayObjUnique([...mappedHiddenByFiat, ...mappedHiddenByCrypto], "identifier")

    addData({
      mappedHiddenByFiat: allMappedHidden,
      mappedHiddenByCrypto: mappedHiddenByCrypto
    })
  }, [
    state.collected.selectedPaymentMethod,
    state.collected.selectedCrypto?.id,
    state.collected.selectedCurrency?.id,
    state.data.allRates,
    state.data.responseGateways?.gateways,
    addData,
    state.data.ICONS_MAP
  ])

  useEffect(() => {
    const getRatesEffect = async () => {
      await getRates()
    }
    getRatesEffect()
  }, [getRates])

  const executeStep = useCallback(
    async (step: NextStep, data: { [key: string]: any }): Promise<NextStep> => {
      return await API.executeStep(step, data, { country: state.collected.selectedCountry })
    }, [state.collected.selectedCountry])

  return (
    <APIContext.Provider value={{
      ...state,
      inputInterface: {
        ...state.inputInterface,
        handleInputChange
      },
      data: {
        ...state.data,
        handleCryptoChange,
        handleCurrencyChange,
        handlePaymentMethodChange
      },
      apiInterface: { init, executeStep, getRates, clearErrors }
    }}>
      {props.children}
    </APIContext.Provider>
  )
}

export { APIProvider, APIContext };

export { ItemCategory, NextStepError }

export type {
  ItemType,
  GatewayRateOption,
  NextStep,
  StepDataItems,
  FileStep,
  InfoDepositBankAccount,
  Filters,
  APIProviderType,
  CollectedStateType,
  GatewayRateOptionSimple
}
