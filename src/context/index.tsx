import React, { createContext, useReducer, useCallback, useEffect, useState } from 'react';

import { StateType, initialState } from './initialState'
import { mainReducer, CollectedActionsType, DataActionsType } from './reducers'

import { arrayUnique, arrayObjUnique } from '../wrappers/utils'

import LogoOnramper from '../icons/logo.svg'

import * as API from './remote'
import { ListItemType } from '../common/types';

export enum ItemType {
  Crypto = 'CRYPTO',
  Currency = 'CURRENCY',
  PaymentMethod = 'PAYMENT_METHOD'
}

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
  const [ICONS_MAP, setICONS_MAP] = useState<{ [key: string]: any }>({});
  const [lastCall, setLastCall] = useState<AbortController>();

  /* DEFINING INPUT INTERFACES */
  const handleInputChange = useCallback(
    (name: string, value: string | number | boolean | ListItemType) => dispatch({ type: CollectedActionsType.AddField, payload: { name, value } }), [])

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
    [],
  )

  /* *********** */

  const addData = useCallback(
    (data: any) => dispatch({ type: DataActionsType.AddData, payload: { value: data } }),
    [],
  )

  /* *********** */
  const init = useCallback(
    async (country?: string) => {

      let response_gateways: any = []
      try {
        response_gateways = await API.gateways({ country, includeIcons: true })
      } catch (error) {
        return { gateways: error.message }
      }

      if (response_gateways.gateways.length <= 0) return { gateways: 'No gateways found.' }

      const ICONS_MAP = response_gateways.icons

      let availableCryptos: any[] = []
      for (var i in response_gateways.gateways) {
        if (!response_gateways.gateways[i].cryptoCurrencies) continue
        availableCryptos = availableCryptos.concat(response_gateways.gateways[i].cryptoCurrencies)
      }
      if (availableCryptos.length <= 0) return
      availableCryptos = arrayObjUnique(availableCryptos, 'code')
      availableCryptos = availableCryptos.map(({ code, precision }) => ({ id: code, name: code, info: ICONS_MAP[code]?.name || 'Cryptocurrency', icon: ICONS_MAP[code]?.icon, precision, symbol: code, type: ItemType.Crypto }))

      let selectedCrypto = availableCryptos.find((crypto: any) => (crypto.id === props.defaultCrypto)) || availableCryptos[0]

      const filtredGatewaysByCrypto = response_gateways.gateways.filter((item: any) => item.cryptoCurrencies.some((crypto: any) => crypto.code === selectedCrypto.id))
      let availableCurrencies: any[] = []
      for (var j in filtredGatewaysByCrypto) {
        if (!filtredGatewaysByCrypto[j].fiatCurrencies) continue
        availableCurrencies = availableCurrencies.concat(filtredGatewaysByCrypto[j].fiatCurrencies)
      }
      availableCurrencies = arrayObjUnique(availableCurrencies, 'code')
      availableCurrencies = availableCurrencies.map(({ code, precision }) => ({ precision: precision, id: code, name: code, symbol: ICONS_MAP[code]?.symbol, info: ICONS_MAP[code]?.name || 'Currency', icon: ICONS_MAP[code]?.icon, type: ItemType.Currency }))

      let selectedCurrency = availableCurrencies.find((currency: any) => currency.id === response_gateways.localization?.currency) || availableCurrencies[0]

      handleInputChange('selectedCrypto', selectedCrypto)
      handleInputChange('selectedCurrency', selectedCurrency)
      addData({ availableCryptos, ICONS_MAP, response_gateways })
      setICONS_MAP(response_gateways.icons)

    }, [addData, handleInputChange, props.defaultCrypto])

  const handleCryptoChange = useCallback(
    async (crypto?: ListItemType) => {

      let gateways = state.data.response_gateways.gateways
      if (!gateways) return
      if (state.data.availableCryptos.length <= 0) return

      const actualCrypto = crypto || state.data.availableCryptos[0]

      const filtredGatewaysByCrypto = gateways.filter((item: any) => item.cryptoCurrencies.some((crypto: any) => crypto.code === actualCrypto.id))

      let availableCurrencies: any[] = []
      for (var i in filtredGatewaysByCrypto) {
        if (!filtredGatewaysByCrypto[i].fiatCurrencies) continue
        availableCurrencies = availableCurrencies.concat(filtredGatewaysByCrypto[i].fiatCurrencies)
      }
      availableCurrencies = arrayObjUnique(availableCurrencies, 'code')
      availableCurrencies = availableCurrencies.map(({ code, precision }) => ({ precision: precision, id: code, name: code, symbol: ICONS_MAP[code]?.symbol, info: ICONS_MAP[code]?.name || 'Currency', icon: ICONS_MAP[code]?.icon, type: ItemType.Currency }))
      addData({ availableCurrencies, filtredGatewaysByCrypto })
      handleInputChange('selectedCrypto', actualCrypto)

    }, [state.data.response_gateways.gateways, state.data.availableCryptos, addData, ICONS_MAP, handleInputChange],
  )

  const handleCurrencyChange = useCallback(
    async (selectedCurrency?: ListItemType) => {

      const filtredGatewaysByCrypto = state.data.filtredGatewaysByCrypto

      if (!filtredGatewaysByCrypto) return
      if (state.data.availableCurrencies.length <= 0) return

      const actualCurrency = state.data.availableCurrencies.find((currency: any) => currency.id === selectedCurrency?.id) || state.data.availableCurrencies[0]
      const filtredGatewaysByCurrency = filtredGatewaysByCrypto.filter((item: any) => item.fiatCurrencies.some((currency: any) => currency.code === actualCurrency.id))

      let availablePaymentMethods: any[] = []
      for (var i in filtredGatewaysByCurrency) {
        if (!filtredGatewaysByCurrency[i].paymentMethods) continue
        availablePaymentMethods = availablePaymentMethods.concat(filtredGatewaysByCurrency[i].paymentMethods)
      }

      availablePaymentMethods = arrayUnique(availablePaymentMethods)
      availablePaymentMethods = availablePaymentMethods.map((item, i) => ({ id: item, name: ICONS_MAP[item].name || `Payment method ${i}`, symbol: '', info: '', icon: ICONS_MAP[item]?.icon, type: ItemType.Currency }))
      addData({ availablePaymentMethods, filtredGatewaysByCurrency, selectedCurrency: actualCurrency })
      handleInputChange('selectedCurrency', actualCurrency)
    }, [handleInputChange, addData, state.data.filtredGatewaysByCrypto, state.data.availableCurrencies, ICONS_MAP],
  )

  const handlePaymentMethodChange = useCallback(
    async (selectedPaymentMethod?: ListItemType) => {

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