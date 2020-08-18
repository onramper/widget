import React, { createContext, useReducer, useCallback, useEffect, useState } from 'react';

import { StateType, initialState } from './initialState'
import { mainReducer, CollectedActionsType, DataActionsType } from './reducers'

import { arrayUnique, arrayObjUnique } from '../wrappers/utils'

import LogoOnramper from '../icons/logo.svg'

import * as API from './api'
import { ItemType, ItemCategory, GatewayOptionType } from '../common/types';
import { IconGatewaysResponse, GatewaysResponse } from './api/types/gateways'
import { RateResponse } from './api/types/rate'
import { NextStep } from './api/types/nextStep';


//Creating context
const APIContext = createContext<StateType>(initialState);

const APIProvider: React.FC<{
  defaultAmount?: number
  defaultAddrs?: { [key: string]: string[] }
  defaultCrypto?: string
  filters?: {
    onlyCryptos?: string[]
    excludeCryptos?: string[]
  }
}> = (props) => {
  const { defaultAmount = 100, defaultAddrs = {} } = props
  const iniState = {
    ...initialState,
    collected: {
      ...initialState.collected,
      amount: defaultAmount,
      defaultAddrs: defaultAddrs
    }
  }
  const [state, dispatch] = useReducer(mainReducer, iniState);
  const [ICONS_MAP, setICONS_MAP] = useState<{ [key: string]: IconGatewaysResponse }>({});
  const [lastCall, setLastCall] = useState<AbortController>();

  /* DEFINING INPUT INTERFACES */
  const handleInputChange = useCallback(
    (name: string, value: string | number | boolean | ItemType) => dispatch({ type: CollectedActionsType.AddField, payload: { name, value } }),
    []
  )

  useEffect(() => {
    if (lastCall) handleInputChange('isCalculatingAmount', true)
    else handleInputChange('isCalculatingAmount', false)
  }, [lastCall, handleInputChange])

  const handleFilesAdded = useCallback(
    (name: string, files: File[], maxFiles: number) => {
      const existingFiles = state.collected['files'].map(f => f.name)
      files = files.filter(f => !existingFiles.includes(f.name))
      if (existingFiles.length + files.length > maxFiles) return false
      dispatch({ type: CollectedActionsType.AddFile, payload: { name, value: files } })
      return true;
    },
    [state.collected],
  )

  const handleFileDeleted = useCallback(
    (name: string, fileName: string) => dispatch({ type: CollectedActionsType.DeleteFile, payload: { name, value: fileName } }),
    []
  )

  /* *********** */

  const addData = useCallback(
    (data: any) => dispatch({ type: DataActionsType.AddData, payload: { value: data } }),
    [],
  )

  /* *********** */
  const gateways = useCallback(
    async (country?: string) => {

      // REQUEST AVAILABLE GATEWAYS
      let response_gateways: GatewaysResponse
      try {
        response_gateways = await API.gateways({ country, includeIcons: true }, { onlyCryptos: props.filters?.onlyCryptos, excludeCryptos: props.filters?.excludeCryptos })
      } catch (error) {
        return { gateways: error.message }
      }
      if (response_gateways.gateways.length <= 0) return { gateways: 'No gateways found.' }

      const ICONS_MAP = response_gateways.icons || {}

      // GET ALL AVAILABLE CRYPTOS
      let availableCryptos: GatewaysResponse['gateways'][0]['cryptoCurrencies'] = []
      for (var i in response_gateways.gateways) {
        if (!response_gateways.gateways[i].cryptoCurrencies) continue
        availableCryptos = availableCryptos.concat(response_gateways.gateways[i].cryptoCurrencies)
      }
      availableCryptos = arrayObjUnique(availableCryptos, 'code')
      if (availableCryptos.length <= 0) return { gateways: 'No cryptos found.' }

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
      let selectedCrypto = mappedAvailableCryptos.find((crypto) => (crypto.id === props.defaultCrypto)) || mappedAvailableCryptos[0]

      // save to state.collected
      handleInputChange('selectedCrypto', selectedCrypto)
      handleInputChange('selectedCountry', response_gateways.localization.country)
      // save to state.date
      addData({
        availableCryptos: mappedAvailableCryptos,
        ICONS_MAP,
        response_gateways
      })
      //save to local state
      setICONS_MAP(response_gateways.icons ?? {})

    }, [addData, handleInputChange, props.defaultCrypto, props.filters])

  const handleCryptoChange = useCallback(
    async (crypto?: ItemType) => {

      // IF RESPONSE IS NOT SET, DON'T DO ANYTHING
      if (!state.data.response_gateways) return
      const gateways = state.data.response_gateways.gateways

      if (gateways.length <= 0) return { gateways: 'No gateways found.' }
      if (state.data.availableCryptos.length <= 0) return { gateways: 'No cryptocurrencies found.' }

      const actualCrypto = state.data.availableCryptos.find((cryptoCurrency) => cryptoCurrency.id === crypto?.id) || state.data.availableCryptos[0]

      // FILTER POSIBLE GATEWAYS BY SELECTED CRYPTO
      const filtredGatewaysByCrypto = gateways.filter((item) => item.cryptoCurrencies.some((crypto) => crypto.code === actualCrypto.id))

      // GET ALL AVAILABLE FIAT CURRENCIES THAT CAN BE USED TO BUY THE SELECTED CRYPTO
      let availableCurrencies: GatewaysResponse['gateways'][0]['fiatCurrencies'] = []
      for (var i in filtredGatewaysByCrypto) {
        if (!filtredGatewaysByCrypto[i].fiatCurrencies) continue
        availableCurrencies = availableCurrencies.concat(filtredGatewaysByCrypto[i].fiatCurrencies)
      }
      availableCurrencies = arrayObjUnique(availableCurrencies, 'code')

      // MAP AVAILABLE FIAT CURRENCIES (CURRENCY LIST) TO AN ITEMTYPE LIST
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

    }, [state.data.response_gateways, state.data.availableCryptos, addData, ICONS_MAP, handleInputChange,],
  )

  const handleCurrencyChange = useCallback(
    async (selectedCurrency?: ItemType) => {

      // IF RESPONSE IS NOT SET, DON'T DO ANYTHING
      const response_gateways = state.data.response_gateways
      if (!response_gateways) return

      const filtredGatewaysByCrypto = state.data.filtredGatewaysByCrypto
      if (!filtredGatewaysByCrypto) return { gateways: 'No gateways availables for the selected crypto.' }
      if (!state.data.availableCurrencies || state.data.availableCurrencies.length <= 0) return { gateways: 'No fiat currencies found.' }

      const actualCurrency =
        state.data.availableCurrencies.find((currency) => currency.id === selectedCurrency?.id)
        || state.data.availableCurrencies.find((currency) => currency.id === response_gateways.localization.currency)
        || state.data.availableCurrencies[0]

      // FILTER POSIBLE GATEWAYS BY SELECTED CURRENCY
      const filtredGatewaysByCurrency = filtredGatewaysByCrypto.filter((item) => item.fiatCurrencies.some((currency) => currency.code === actualCurrency.id))

      // GET ALL AVAILABLE PAYMENT METHODS THAT CAN BE USED TO BUY THE SELECTED CRYPTO WITH THE SELECTED CURRENCY
      let availablePaymentMethods: GatewaysResponse['gateways'][0]['paymentMethods'] = []
      for (var i in filtredGatewaysByCurrency) {
        if (!filtredGatewaysByCurrency[i].paymentMethods) continue
        availablePaymentMethods = availablePaymentMethods.concat(filtredGatewaysByCurrency[i].paymentMethods)
      }
      availablePaymentMethods = arrayUnique(availablePaymentMethods)

      // MAP AVAILABLE FIAT CURRENCIES (CURRENCY LIST) TO AN ITEMTYPE LIST
      const mappedAvailablePaymentMethods: ItemType[] = availablePaymentMethods.map((item, i) => ({
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

    }, [handleInputChange, addData, state.data.filtredGatewaysByCrypto, state.data.availableCurrencies, ICONS_MAP, state.data.response_gateways],
  )

  const handlePaymentMethodChange = useCallback(
    async (selectedPaymentMethod?: ItemType) => {

      // IF RESPONSE IS NOT SET, DON'T DO ANYTHING
      if (!state.data.response_gateways) return
      if (!state.data.availablePaymentMethods || state.data.availablePaymentMethods.length <= 0) return { gateways: 'No payment methods found.' }

      const actualPaymentMethod = state.data.availablePaymentMethods.find((currency) => currency.id === selectedPaymentMethod?.id) || state.data.availablePaymentMethods[0]

      // save to state.collected
      handleInputChange('selectedPaymentMethod', actualPaymentMethod)

    }, [handleInputChange, state.data.availablePaymentMethods, state.data.response_gateways])

  const getRates = useCallback(
    async () => {

      // IF RESPONSE IS NOT SET, DON'T DO ANYTHING
      if (!state.data.response_gateways) return

      // IF THE AMOUNT IS NOT SET OR IT'S ===0 THEN NO AVAILABLE RATES
      if (!state.collected.amount) {
        addData({ availableRates: [] })
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
      let response_rate: RateResponse
      try {
        response_rate = await API.rate(inCurrency, outCurrency, actualAmount, actualPaymentMethod, { amountInCrypto: state.collected.amountInCrypto, includeIcons: true }, signal)
      } catch (error) {
        if (error.name === 'AbortError')
          return {}
        setLastCall(undefined)
        return { rate: error.message }
      }

      // IF THE REQUEST DIDN'T THROW ANY ERROR, CLEAR THE ABORT CONTROLLER FROM THE STATE
      setLastCall(undefined)

      if (response_rate.length <= 0) return { rate: 'No gateways found.' }

      // MAP RATES TO GatewayOptionType
      const mappedAvailableRates: GatewayOptionType[] = response_rate.map((item) => ({
        id: item.identifier,
        name: item.identifier,
        duration: item.duration,
        available: item.available,
        rate: item.rate,
        fees: item.fees,
        requiredKYC: item.requiredKYC,
        receivedCrypto: item.receivedCrypto,
        nextStep: item.nextStep,
        error: item.error?.message,
        logo: item.icon || LogoOnramper
      }))

      // save to state.date
      addData({ availableRates: mappedAvailableRates, response_rate })

      // IF THERE ARE NO RATES AVAILABLES THEN REDUCE UNAVAILABLE RATES TO AN ERRORS OBJECT
      const filtredRatesByAviability = response_rate.filter((item) => item.available)
      if (filtredRatesByAviability.length <= 0) {
        const minMaxErrors = response_rate.reduce((minMaxErrors: { [key: string]: any }, item) => {
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
        return { 'input-amount': minMaxErrors.MIN?.message ?? minMaxErrors.MAX?.message }
      }

      // IF NO ERRORS, RETURN UNDEFINED
      return
    }, [addData, state.collected.selectedCrypto, state.collected.selectedCurrency, state.collected.amount, state.collected.amountInCrypto, state.data.response_gateways, state.collected.selectedPaymentMethod])

  const executeStep = useCallback(async (step: NextStep, data: { [key: string]: any }) => {
    return await API.executeStep(step, data)
  }, [])

  return (
    <APIContext.Provider value={{
      ...state,
      inputInterface: {
        handleInputChange,
        handleFilesAdded,
        handleFileDeleted
      },
      data: {
        ...state.data,
        gateways,
        handleCryptoChange,
        handleCurrencyChange,
        handlePaymentMethodChange,
      },
      apiInterface: {
        executeStep,
        getRates
      }
    }}>
      {props.children}
    </APIContext.Provider>
  )
}

export { APIProvider, APIContext };