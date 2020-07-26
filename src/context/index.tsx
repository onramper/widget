import React, { createContext, useReducer, useCallback, useEffect, useState } from 'react';

import { StateType, initialState } from './initialState'
import { mainReducer, CollectedActionsType, DataActionsType } from './reducers'

import { arrayUnique } from '../wrappers/utils'

import LogoOnramper from '../icons/logo.svg'

import * as API from './remote'
import * as DATAS from './maps'
import { ListItemType } from '../common/types';

//Creating context
const APIContext = createContext<StateType>(initialState);

const APIProvider: React.FC<{ defaultAmount?: number, defaultAddrs?: { [key: string]: string[] } }> = (props) => {
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

  /* DEFINING INPUT INTERFACES */
  const handleInputChange = useCallback(
    (name: string, value: string | number | ListItemType) => dispatch({ type: CollectedActionsType.AddField, payload: { name, value } }),
    [],
  )

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
      const response_gateways = await API.gateways({ country, includeIcons: true })

      addData({ response_gateways: response_gateways })

      const ICONS_MAP = response_gateways.icons

      let availableCryptos: any[] = []
      for (var i in response_gateways.gateways) {
        availableCryptos = availableCryptos.concat(response_gateways.gateways[i].supportedCrypto)
      }
      availableCryptos = arrayUnique(availableCryptos)
      availableCryptos = availableCryptos.map((item) => ({ id: item, name: item, info: ICONS_MAP[item]?.name || 'Cryptocurrency', icon: ICONS_MAP[item]?.icon }))
      addData({ availableCryptos, ICONS_MAP })
      setICONS_MAP(response_gateways.icons)

    }, [addData])

  const handleCryptoChange = useCallback(
    async (crypto?: ListItemType) => {

      const selectedCrypto = state.collected.selectedCrypto

      let gateways = state.data.response_gateways.gateways
      if (!gateways) return
      if (state.data.availableCryptos.length <= 0) return

      const actualCrypto = crypto || selectedCrypto || state.data.availableCryptos[0]

      const filtredGatewaysByCrypto = gateways.filter((item: any) => item.supportedCrypto.includes(actualCrypto.id))

      let availableCurrencies: any[] = []
      for (var i in filtredGatewaysByCrypto) {
        availableCurrencies = availableCurrencies.concat(filtredGatewaysByCrypto[i].supportedCurrencies)
      }
      availableCurrencies = arrayUnique(availableCurrencies)
      availableCurrencies = availableCurrencies.map((item) => ({ id: item, name: item, symbol: ICONS_MAP[item]?.symbol, info: ICONS_MAP[item]?.name || 'Currency', icon: ICONS_MAP[item]?.icon }))
      addData({ availableCurrencies, filtredGatewaysByCrypto })
      handleInputChange('selectedCrypto', actualCrypto)

    }, [state.data.response_gateways.gateways, state.data.availableCryptos, addData, state.collected.selectedCrypto, ICONS_MAP, handleInputChange],
  )

  const handleCurrencyChange = useCallback(
    async (currency?: ListItemType) => {

      const selectedCurrency = state.collected.selectedCurrency

      const filtredGatewaysByCrypto = state.data.filtredGatewaysByCrypto

      if (!filtredGatewaysByCrypto) return
      if (state.data.availableCurrencies.length <= 0) return

      const actualCurrency = currency || selectedCurrency || state.data.availableCurrencies[0]
      const filtredGatewaysByCurrency = filtredGatewaysByCrypto.filter((item: any) => item.supportedCurrencies.includes(actualCurrency.id))

      let availablePaymentMethods: any[] = []
      for (var i in filtredGatewaysByCurrency) {
        availablePaymentMethods = availablePaymentMethods.concat(filtredGatewaysByCurrency[i].paymentMethods)
      }

      availablePaymentMethods = arrayUnique(availablePaymentMethods)
      availablePaymentMethods = availablePaymentMethods.map((item, i) => ({ id: item, name: ICONS_MAP[item].name || `Payment method ${i}`, symbol: '', info: '', icon: ICONS_MAP[item]?.icon }))
      addData({ availablePaymentMethods, filtredGatewaysByCurrency, selectedCurrency: actualCurrency })
      handleInputChange('selectedCurrency', actualCurrency)
    }, [handleInputChange, addData, state.data.filtredGatewaysByCrypto, state.data.availableCurrencies, state.collected.selectedCurrency, ICONS_MAP],
  )

  const handlePaymentMethodChange = useCallback(
    async (paymentMehtod?: ListItemType) => {

      const selectedPaymentMethod = state.collected.selectedPaymentMethod

      if (state.data.availablePaymentMethods.length <= 0) return

      const actualPaymentMethod = paymentMehtod || selectedPaymentMethod || state.data.availablePaymentMethods[0]
      const actualAmount = state.collected.amount || 0

      const inCurrency = state.collected.selectedCurrency?.id
      const outCurrency = state.collected.selectedCrypto?.id

      if (actualAmount <= 0) return addData({ availableRates: [] })
      if (!inCurrency || !outCurrency || !actualPaymentMethod.id) return
      const response_rate = await API.rate(inCurrency, outCurrency, actualAmount, actualPaymentMethod.id)

      const filtredRatesByAviability = response_rate.filter((item: any) => item.available === true)
      const availableRates = filtredRatesByAviability.map((item: any) => ({
        receivedCrypto: item.receivedCrypto,
        fees: item.fees,
        name: item.identifier,
        txTime: item.duration.replace(' ' + item.duration.split(' ')[1], DATAS.TXTIMES_MAP[item.duration.split(' ')[1]]),
        kycLevel: `${item.requiredKYC.length}`,
        rate: item.rate,
        feePercent: (item.fees / state.collected.amount * 100),
        logo: LogoOnramper,
        nextStep: item.nextStep
      }))

      addData({ availableRates, response_rate, filtredRatesByAviability })
      handleInputChange('selectedPaymentMethod', actualPaymentMethod)

      if (response_rate.length <= 0) return { general: 'Try again later' }
      else if (filtredRatesByAviability.length <= 0) {
        const errorsBulk = response_rate.reduce((errorsBulk: { [key: string]: any }, item: any) => {
          if (!item.error) return errorsBulk
          switch (item.error.type) {
            case 'MIN':
              if (!errorsBulk[item.error.type] || item.error.limit < errorsBulk[item.error.type].limit) {
                errorsBulk[item.error.type] = { message: item.error.message, limit: item.error.limit }
              }
              return errorsBulk
            case 'MAX':
              if (!errorsBulk[item.error.type] || item.error.limit > errorsBulk[item.error.type].limit) {
                errorsBulk[item.error.type] = { message: item.error.message, limit: item.error.limit }
              }
              return errorsBulk
            default:
              errorsBulk[item.error.type] = item.error.message
              return errorsBulk
          }
        }, {})
        return { ...errorsBulk, amount: errorsBulk.MIN ?? errorsBulk.MAX }
      }
      else return
    }, [handleInputChange, addData, state.collected.selectedCrypto, state.collected.selectedCurrency, state.data.availablePaymentMethods, state.collected.amount, state.collected.selectedPaymentMethod])

  /* SET NEXTSTEP ON SELECTEDGATEWAY CHANGE */
  useEffect(() => {
    const nextStep = state.collected.selectedGateway?.nextStep
    addData({ nextStep })
  }, [state.collected.selectedGateway, addData])

  const sendCodeEmail = useCallback(async () => {
    if (!state.data.nextStep?.url) return false
    return await API.email(state.data.nextStep.url, state.collected.email)
  }, [state.data.nextStep, state.collected.email])

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
        sendCodeEmail
      }
    }}>
      {props.children}
    </APIContext.Provider>
  )
}

export { APIProvider, APIContext };