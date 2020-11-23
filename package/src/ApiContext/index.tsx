import React, { createContext, useReducer, useCallback, useEffect, useState } from 'react';

import { StateType, initialState, ErrorObjectType, ItemCategory } from './initialState'
import { mainReducer, CollectedActionsType, DataActionsType } from './reducers'

import { arrayUnique, arrayObjUnique } from '../utils'

import LogoOnramper from '../icons/onramper_logo.svg'

import * as API from './api'
import type { ItemType, GatewayRateOption } from './initialState';
import { GatewaysResponse } from './api/types/gateways'
import { RateResponse } from './api/types/rate'
import type { NextStep, StepDataItems, FileStep, InfoDepositBankAccount } from './api/types/nextStep';

import { NextStepError } from './api'

import phoneCodes from './utils/phoneCodes'

const BASE_DEFAULT_AMOUNT_IN_USD = 100

//Creating context
const APIContext = createContext<StateType>(initialState);

interface APIProviderType {
  API_KEY?: string,
  defaultAmount?: number
  defaultAddrs?: { [key: string]: string[] }
  defaultCrypto?: string
  filters?: {
    onlyCryptos?: string[]
    excludeCryptos?: string[]
  }
}

const APIProvider: React.FC<APIProviderType> = (props) => {
  const { defaultAmount = 100, defaultAddrs = {}, API_KEY } = props
  const iniState = {
    ...initialState,
    collected: {
      ...initialState.collected,
      amount: defaultAmount < 0 ? initialState.collected.amount : defaultAmount,
      defaultAddrs: Object.entries(defaultAddrs).reduce((acc, [key, value]) => ({ ...acc, [key.toUpperCase()]: value }), {})
    }
  }
  const [state, dispatch] = useReducer(mainReducer, iniState);
  const [lastCall, setLastCall] = useState<AbortController>();

  // INITIALIZING AUTHENTICATION
  useEffect(() => {
    if (API_KEY)
      API.authenticate(API_KEY)
  }, [API_KEY])

  /* DEFINING INPUT INTERFACES */
  const handleInputChange = useCallback(
    (name: string, value: string | number | boolean | ItemType | ErrorObjectType[]) => dispatch({ type: CollectedActionsType.AddField, payload: { name, value } }),
    []
  )

  useEffect(() => {
    if (lastCall) handleInputChange('isCalculatingAmount', true)
    else handleInputChange('isCalculatingAmount', state.data.responseRate === undefined)
  }, [lastCall, handleInputChange, state.data.responseRate])


  /* *********** */

  const addData = useCallback(
    (data: any) => dispatch({ type: DataActionsType.AddData, payload: { value: data } }),
    []
  )

  const processErrors = useCallback((name: string, type: string, message: string) => {
    const error = {
      [name]: {
        type: type,
        message: message
      }
    }
    dispatch({ type: CollectedActionsType.AddError, payload: { value: error } })
    return error
  }, [])

  const clearErrors = useCallback(() => {
    dispatch({ type: CollectedActionsType.AddError, payload: { value: undefined } })
  }, [])

  /* *********** */
  const init = useCallback(
    async (country?: string): Promise<ErrorObjectType | undefined | {}> => {
      clearErrors()

      const actualCountry = country
      // REQUEST AVAILABLE GATEWAYS
      let responseGateways: GatewaysResponse
      try {
        responseGateways = await API.gateways({ country: actualCountry, includeIcons: true, includeDefaultAmounts: true }, { onlyCryptos: props.filters?.onlyCryptos, excludeCryptos: props.filters?.excludeCryptos })
      } catch (error) {
        return processErrors("GATEWAYS", "API", error.message)
      }
      if (responseGateways.gateways.length <= 0) {
        return processErrors("GATEWAYS", "NO_GATEWAYS", "No gateways found.")
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
        return processErrors("GATEWAYS", "NO_CRYPTOS", "No cryptos found.")
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

      // SELECT DEFAULT CRYPTO
      const selectedCrypto = mappedAvailableCryptos.find((crypto) => (crypto.id === props.defaultCrypto)) || mappedAvailableCryptos[0]

      // save to state.collected
      handleInputChange('selectedCrypto', selectedCrypto)
      handleInputChange('selectedCountry', responseGateways.localization.country)
      handleInputChange("phoneCountryCode", +phoneCodes[responseGateways.localization.country.toUpperCase() ?? 'GB']?.phoneCode)
      // save to state.date
      addData({
        availableCryptos: mappedAvailableCryptos,
        ICONS_MAP,
        responseGateways: responseGateways
      })

    }, [addData, handleInputChange, props.defaultCrypto, props.filters, processErrors, clearErrors])

  const handleCryptoChange = useCallback(
    (crypto?: ItemType): ErrorObjectType | undefined | {} => {
      crypto = crypto ?? state.collected.selectedCrypto

      // IF RESPONSE IS NOT SET YET, DON'T DO ANYTHING
      if (!state.data.responseGateways) return {}
      const gateways = state.data.responseGateways.gateways

      if (gateways.length <= 0) return {}
      if (state.data.availableCryptos.length <= 0) return {}

      const actualCrypto = state.data.availableCryptos.find((cryptoCurrency) => cryptoCurrency.id === crypto?.id) || state.data.availableCryptos[0]

      // FILTER POSIBLE GATEWAYS BY SELECTED CRYPTO
      const filtredGatewaysByCrypto = gateways.filter((item) => item.cryptoCurrencies.some((crypto) => crypto.code === actualCrypto.id))

      // GET ALL AVAILABLE FIAT CURRENCIES THAT CAN BE USED TO BUY THE SELECTED CRYPTO
      let availableCurrencies: GatewaysResponse['gateways'][0]['fiatCurrencies'] = []
      for (const i in filtredGatewaysByCrypto) {
        if (!filtredGatewaysByCrypto[i].fiatCurrencies) continue
        availableCurrencies = availableCurrencies.concat(filtredGatewaysByCrypto[i].fiatCurrencies)
      }
      availableCurrencies = arrayObjUnique(availableCurrencies, 'code')

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

    }, [state.data.responseGateways, state.data.availableCryptos, addData, handleInputChange, state.collected.selectedCrypto]
  )

  const handleCurrencyChange = useCallback(
    (selectedCurrency?: ItemType): ErrorObjectType | undefined | {} => {
      selectedCurrency = selectedCurrency ?? state.collected.selectedCurrency

      // IF RESPONSE IS NOT SET, DON'T DO ANYTHING
      const responseGateways = state.data.responseGateways
      if (!responseGateways) return {}

      // IF LIST IS EMPTY, DON'T DO ANYTHING
      const filtredGatewaysByCrypto = state.data.filtredGatewaysByCrypto
      if (!filtredGatewaysByCrypto || filtredGatewaysByCrypto.length <= 0) return {}
      if (!state.data.availableCurrencies || state.data.availableCurrencies.length <= 0) return {}

      const actualCurrency =
        state.data.availableCurrencies.find((currency) => currency.id === selectedCurrency?.id)
        || state.data.availableCurrencies.find((currency) => currency.id === responseGateways.localization.currency)
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

    }, [handleInputChange, addData, state.data.filtredGatewaysByCrypto, state.data.availableCurrencies, state.data.responseGateways, state.collected.selectedCurrency, defaultAmount]
  )

  const handlePaymentMethodChange = useCallback(
    (selectedPaymentMethod?: ItemType): ErrorObjectType | undefined | {} => {

      selectedPaymentMethod = selectedPaymentMethod ?? state.collected.selectedPaymentMethod

      // IF RESPONSE IS NOT SET, DON'T DO ANYTHING
      if (!state.data.responseGateways) return {}
      if (!state.data.availablePaymentMethods || state.data.availablePaymentMethods.length <= 0) return {}

      const actualPaymentMethod = state.data.availablePaymentMethods.find((currency) => currency.id === selectedPaymentMethod?.id) || state.data.availablePaymentMethods[0]

      // save to state.collected
      handleInputChange('selectedPaymentMethod', actualPaymentMethod)

    }, [handleInputChange, state.data.availablePaymentMethods, state.data.responseGateways, state.collected.selectedPaymentMethod])

  const getRates = useCallback(
    async (): Promise<ErrorObjectType | undefined | {}> => {
      clearErrors()
      // IF RESPONSE IS NOT SET, DON'T DO ANYTHING
      if (!state.data.responseGateways) return

      // IF THE AMOUNT IS NOT SET OR IT'S ===0 THEN NO AVAILABLE RATES
      if (!state.collected.amount) {
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
      try {
        responseRate = await API.rate(inCurrency, outCurrency, actualAmount, actualPaymentMethod, { country: state.collected.selectedCountry, amountInCrypto: state.collected.amountInCrypto, includeIcons: true }, signal)
      } catch (error) {
        if (error.name === 'AbortError')
          return {}
        setLastCall(undefined)
        return processErrors("RATE", "API", error.message)
      }

      // IF THE REQUEST DIDN'T THROW ANY ERROR, CLEAR THE ABORT CONTROLLER FROM THE STATE
      setLastCall(undefined)

      if (!responseRate || responseRate.length <= 0) return processErrors("RATE", "NO_RATES", "No rates found")

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
              if (!minMaxErrors[item.error.type] || ((item.error.limit ?? Number.POSITIVE_INFINITY) < minMaxErrors[item.error.type].limit)) {
                minMaxErrors[item.error.type] = { message: item.error.message, limit: item.error.limit }
              }
              return minMaxErrors
            case 'MAX':
              if (!minMaxErrors[item.error.type] || ((item.error.limit ?? Number.NEGATIVE_INFINITY) > minMaxErrors[item.error.type].limit)) {
                minMaxErrors[item.error.type] = { message: item.error.message, limit: item.error.limit }
              }
              return minMaxErrors
            default:
              minMaxErrors[item.error.type] = item.error.message
              return minMaxErrors
          }
        }, {})
        return processErrors("amount", "PARAM", minMaxErrors.MIN?.message ?? minMaxErrors.MAX?.message)
      }

      // IF NO ERRORS, RETURN UNDEFINED
      return undefined
    }, [addData, state.collected.selectedCountry, state.collected.selectedCrypto, state.collected.selectedCurrency, state.collected.amount, state.collected.amountInCrypto, state.data.responseGateways, state.collected.selectedPaymentMethod, processErrors, clearErrors])

  useEffect(() => {
    handleCryptoChange()
  }, [handleCryptoChange])

  useEffect(() => {
    handleCurrencyChange()
  }, [handleCurrencyChange])

  useEffect(() => {
    handlePaymentMethodChange()
  }, [handlePaymentMethodChange])

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
      apiInterface: { init, executeStep, getRates }
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
  InfoDepositBankAccount
}
