import React, { createContext, useReducer, useCallback, useEffect, useState } from 'react';

import { StateType, initialState } from './initialState'
import { mainReducer, CollectedActionsType, DataActionsType } from './reducers'

import { arrayUnique, arrayObjUnique } from '../wrappers/utils'

import LogoOnramper from '../icons/logo.svg'

import * as API from './api'
import { ItemType, ItemCategory } from '../common/types';
import { IconGatewaysResponse, GatewaysResponse } from './api/types/gateways'


//Creating context
const APIContext = createContext<StateType>(initialState);

const APIProvider: React.FC<{ defaultAmount?: number, defaultAddrs?: { [key: string]: string[] }, defaultCrypto?: string }> = (props) => {
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
      const existingFiles = state.collected['files-id'].map(f => f.name)
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
  const init = useCallback(
    async (country?: string) => {

      // REQUEST AVAILABLE GATEWAYS
      let response_gateways: GatewaysResponse
      try {
        response_gateways = await API.gateways({ country, includeIcons: true })
      } catch (error) {
        return { gateways: error.message }
      }
      if (response_gateways.gateways.length <= 0) return { gateways: 'No gateways found.' }

      const ICONS_MAP = response_gateways.icons

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
//-----------------START ON CRYPTO CHANGE
      // FILTER POSIBLE GATEWAYS BY SELECTED CRYPTO
      const filtredGatewaysByCrypto = response_gateways.gateways.filter((item) => item.cryptoCurrencies.some((crypto) => crypto.code === selectedCrypto.id))

      // GET ALL AVAILABLE FIAT CURRENCIES THAT CAN BE USED TO BUY THE SELECTED CRYPTO
      let availableCurrencies: GatewaysResponse['gateways'][0]['fiatCurrencies'] = []
      for (var j in filtredGatewaysByCrypto) {
        if (!filtredGatewaysByCrypto[j].fiatCurrencies) continue
        availableCurrencies = availableCurrencies.concat(filtredGatewaysByCrypto[j].fiatCurrencies)
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

      // SELECT DEFAULT FIAT CURRENCY
      let selectedCurrency = mappedAvailableCurrencies.find((currency) => currency.id === response_gateways.localization.currency) || mappedAvailableCurrencies[0]
//-----------------END ON CRYPTO CHANGE
      // FILTER FILTRED GATEWAYS BY SELECTED CRYPTO BY SELECTED CURRENCY
      const filtredGatewaysByCurrency = filtredGatewaysByCrypto.filter((item) => item.fiatCurrencies.some((currency) => currency.code === selectedCurrency.id))

      // GET ALL AVAILABLE PAUMENT METHODS THAT CAN BE USED TO BUY THE SELECTED CRYPTO WITH THE SELECTED FIAT CURRENCY
      let availablePaymentMethods: GatewaysResponse['gateways'][0]['paymentMethods'] = []
      for (let i in filtredGatewaysByCurrency) {
        if (!filtredGatewaysByCurrency[i].paymentMethods) continue
        availablePaymentMethods = availablePaymentMethods.concat(filtredGatewaysByCurrency[i].paymentMethods)
      }
      availablePaymentMethods = arrayUnique(availablePaymentMethods)

      // MAP AVAILABLE PAYMENT METHODS TO AN ITEMTYPE LIST
      const mappedAvailablePaymentMethods: ItemType[] = availablePaymentMethods.map((item, i) => ({
        id: item,
        name: ICONS_MAP[item].name || `Payment method ${i}`,
        icon: ICONS_MAP[item]?.icon,
        type: ItemCategory.PaymentMethod
      }))

      // SELECT DEFAULT PAYMENT METHOD
      let selectedPaymentMethod = mappedAvailableCurrencies[0]

      // save to state.collected
      handleInputChange('selectedCrypto', selectedCrypto)
      handleInputChange('selectedCurrency', selectedCurrency)
      handleInputChange('selectedPaymentMethod', selectedPaymentMethod)
      // save to state.date
      addData({
        availableCryptos: mappedAvailableCryptos,
        availableCurrencies: mappedAvailableCurrencies,
        availablePaymentMethods: mappedAvailablePaymentMethods,
        ICONS_MAP,
        response_gateways
      })
      //save to local state
      setICONS_MAP(response_gateways.icons)

    }, [addData, handleInputChange, props.defaultCrypto])

  const handleCryptoChange = useCallback(
    async (crypto?: ItemType) => {

      const gateways = state.data.response_gateways?.gateways
      if (!gateways) return { gateways: 'No gateways found.' }
      if (state.data.availableCryptos.length <= 0) return { gateways: 'No cryptocurrencies found.' }

      
      const actualCrypto = crypto || state.data.availableCryptos[0]

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

    }, [state.data.response_gateways, state.data.availableCryptos, addData, ICONS_MAP, handleInputChange, ],
  )

  const handleCurrencyChange = useCallback(
    async (selectedCurrency?: ItemType) => {

      const filtredGatewaysByCrypto = state.data.filtredGatewaysByCrypto
      //CHECK IF filtredGatewaysByCrypto IS ALREADY SET
      if (!filtredGatewaysByCrypto) return { gateways: 'No gateways availables for the selected crypto.' }
      if (state.data.availableCurrencies.length <= 0) return { gateways: 'No fiat currencies found.' }

      const actualCurrency = state.data.availableCurrencies.find((currency) => currency.id === selectedCurrency?.id) || state.data.availableCurrencies[0]
      const filtredGatewaysByCurrency = filtredGatewaysByCrypto.filter((item) => item.fiatCurrencies.some((currency) => currency.code === actualCurrency.id))

      let availablePaymentMethods: any[] = []
      for (var i in filtredGatewaysByCurrency) {
        if (!filtredGatewaysByCurrency[i].paymentMethods) continue
        availablePaymentMethods = availablePaymentMethods.concat(filtredGatewaysByCurrency[i].paymentMethods)
      }

      availablePaymentMethods = arrayUnique(availablePaymentMethods)
      availablePaymentMethods = availablePaymentMethods.map((item, i) => ({ id: item, name: ICONS_MAP[item].name || `Payment method ${i}`, symbol: '', info: '', icon: ICONS_MAP[item]?.icon, type: ItemCategory.Currency }))
      addData({ availablePaymentMethods, filtredGatewaysByCurrency, selectedCurrency: actualCurrency })
      handleInputChange('selectedCurrency', actualCurrency)
    }, [handleInputChange, addData, state.data.filtredGatewaysByCrypto, state.data.availableCurrencies, ICONS_MAP],
  )

  const handlePaymentMethodChange = useCallback(
    async (selectedPaymentMethod?: ItemType) => {

      if (state.data.availablePaymentMethods.length <= 0) return

      const actualPaymentMethod = state.data.availablePaymentMethods.find((currency: any) => currency.id === selectedPaymentMethod?.id) || state.data.availablePaymentMethods[0]
      handleInputChange('selectedPaymentMethod', actualPaymentMethod)

      const actualAmount = state.collected.amount || 0

      if (actualAmount <= 0) {
        addData({ availableRates: [] })
        return {}
      }
      const inCurrency = state.collected.selectedCurrency?.id
      const outCurrency = state.collected.selectedCrypto?.id
      if (!inCurrency || !outCurrency || !actualPaymentMethod.id) return

      const controller = new AbortController()
      const { signal } = controller;
      setLastCall(lastController => {
        lastController?.abort();
        return controller
      })
      let response_rate = []
      try {
        response_rate = await API.rate(inCurrency, outCurrency, actualAmount, actualPaymentMethod.id, { amountInCrypto: state.collected.amountInCrypto }, signal)
      } catch (error) {
        if (error.name === 'AbortError')
          return {}
        setLastCall(undefined)
        return { rate: error.message }
      }

      setLastCall(undefined)

      if (response_rate.length <= 0) return { rate: 'No gateways found.' }

      const filtredRatesByAviability = response_rate.filter((item: any) => item.available)
      const availableRates = response_rate.map((item: any) => ({
        receivedCrypto: item.receivedCrypto,
        fees: item.fees,
        name: item.identifier,
        txTime: { seconds: item.duration.seconds, message: item.duration.message },
        kycLevel: `${item.requiredKYC?.length}`,
        rate: item.rate,
        feePercent: (item.fees / (state.collected.amountInCrypto ? item.receivedCrypto : state.collected.amount) * 100),
        logo: LogoOnramper,
        nextStep: item.nextStep,
        available: item.available,
        error: item.error?.message
      }))

      addData({ availableRates, response_rate, filtredRatesByAviability })

      if (filtredRatesByAviability.length <= 0) {
        let minMaxErrors: { [key: string]: any } = {}
        const errorsBulk = response_rate.reduce((errorsBulk: { [key: string]: any }, item: any) => {
          if (!item.error) return errorsBulk
          switch (item.error.type) {
            case 'MIN':
              if (!minMaxErrors[item.error.type] || item.error.limit < minMaxErrors[item.error.type].limit) {
                minMaxErrors[item.error.type] = { message: item.error.message, limit: item.error.limit }
              }
              return errorsBulk
            case 'MAX':
              if (!minMaxErrors[item.error.type] || item.error.limit > minMaxErrors[item.error.type].limit) {
                minMaxErrors[item.error.type] = { message: item.error.message, limit: item.error.limit }
              }
              return errorsBulk
            default:
              errorsBulk[item.error.type] = item.error.message
              return errorsBulk
          }
        }, {})
        return { ...errorsBulk, 'input-amount': minMaxErrors.MIN ?? minMaxErrors.MAX }
      }
    }, [handleInputChange, addData, state.collected.selectedCrypto, state.collected.selectedCurrency, state.data.availablePaymentMethods, state.collected.amount, state.collected.amountInCrypto])

  /* SET NEXTSTEP ON SELECTEDGATEWAY CHANGE */
  useEffect(() => {
    const nextStep = state.collected.selectedGateway?.nextStep
    addData({ nextStep })
  }, [state.collected.selectedGateway, addData])

  const executeStep = useCallback(async (url: string, data: { [key: string]: any }) => {
    return await API.executeStep(url, data)
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
        init,
        handleCryptoChange,
        handleCurrencyChange,
        handlePaymentMethodChange
      },
      apiInterface: {
        executeStep
      }
    }}>
      {props.children}
    </APIContext.Provider>
  )
}

export { APIProvider, APIContext };