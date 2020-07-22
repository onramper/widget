import React, { createContext, useReducer, useCallback } from 'react';
import { ListItemType } from '../common/types'
import { GatewayOptionType } from '../ChooseGatewayView/GatewayOption'

import { arrayUnique } from './utils'

import IconNEO from '../icons/neoicon.png'
import IconUSD from '../icons/usd.svg'
import IconCC from '../icons/ccs.svg'

import LogoOnramper from '../icons/logo.svg'

import * as API from '../api'

import * as DATAS from '../api/helper'

type CollectedStateType = {
  amount: number,
  "files-id": File[],
  selectedCrypto: number,
  selectedCurrency: number,
  selectedPaymentMethod: number,
  selectedGateway: number,
  walletAddress: string,
  "personal-fname": string,
  "personal-lname": string,
  "personal-birth": string,
  'personal-address': string
  'personal-address2': string
  'personal-city': string
  'personal-postalcode': string
  'personal-country': string
  [key: string]: any//todo, add all inputs
}

/* ___________ */

type DataStateType = {
  availableCryptos: ListItemType[],
  availableCurrencies: ListItemType[],
  availablePaymentMethods: ListItemType[],
  availableRates: GatewayOptionType[],
  [key: string]: any
  init: (country?: string) => void,
  onCryptoChange: (crypto?: string) => Promise<any>
  onCurrencyChange: (currency?: string) => void
  onPaymentMethodChange: (paymentMehtod?: string) => any
  onPriceChange: (amount: number) => void
  //remote responses
  response_gateways: any
  filtredGatewaysByCrypto: any[]
  filtredGatewaysByCurrency: any[]
  response_rate: any[]
  filtredRatesByAviability: any[]
}

type DataInterfaceType = {
  addData: (data: DataStateType) => void
}

type InputInterfaceType = {
  handleInputChange: (name: string, value: any) => void
  handleFilesAdded: (name: string, files: File[], maxFiles: number) => boolean,
  handleFileDeleted: (name: string, fileName: string) => void
}

type StateType = {
  data: DataStateType,
  collected: CollectedStateType
  inputInterface: InputInterfaceType
  dataInterface: DataInterfaceType
}

const initialState = {
  data: {
    availableCryptos: [],
    availableCurrencies: [],
    availablePaymentMethods: [],
    availableRates: [],
    init: (country?: string | null) => null,
    onCryptoChange: async (crypto?: string) => null,
    onCurrencyChange: (currency?: string) => null,
    onPaymentMethodChange: (paymentMehtod?: string) => null,
    onPriceChange: (amount: number) => null,
    response_gateways: {},
    filtredGatewaysByCrypto: [],
    filtredGatewaysByCurrency: [],
    response_rate: [],
    filtredRatesByAviability: []
  },
  collected: {
    amount: 100,
    'files-id': [],
    selectedCrypto: 0,
    selectedCurrency: 0,
    selectedPaymentMethod: 0,
    selectedGateway: 0,
    walletAddress: '',
    "personal-fname": '',
    "personal-lname": '',
    "personal-birth": '',
    'personal-address': '',
    'personal-address2': '',
    'personal-city': '',
    'personal-postalcode': '',
    'personal-country': '',
  },
  inputInterface: {
    handleInputChange: () => null,
    handleFilesAdded: () => true,
    handleFileDeleted: () => null,
    //todo: split remote and local and add files
  },
  dataInterface: {
    addData: (data: any) => null
  }
}

enum CollectedActionsType {
  AddField = 'ADD_FIELD',
  AddFile = 'ADD_FILE',
  DeleteFile = 'DELETE_FILE'
}

enum DataActionsType {
  AddData = 'ADD_DATA',
  Init = 'INIT'
}

//Creating context
const APIContext = createContext<StateType>(initialState);


const APIProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  const handleInputChange = useCallback(
    (name: string, value: string | number) => dispatch({ type: CollectedActionsType.AddField, payload: { name, value } }),
    [],
  )

  const handleFilesAdded = useCallback(
    (name: string, files: File[], maxFiles: number) => {
      const existingFiles = state.collected["files-id"].map(f => f.name)
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

  const addData = useCallback(
    (data: any) => dispatch({ type: DataActionsType.AddData, payload: { value: data } }),
    [],
  )

  const init = useCallback(
    async (country?: string) => {
      const response_gateways = await API.gateways(country)

      addData({ response_gateways: response_gateways })

      let availableCryptos: any[] = []
      for (var i in response_gateways.gateways) {
        availableCryptos = availableCryptos.concat(response_gateways.gateways[i].supportedCrypto)
      }
      availableCryptos = arrayUnique(availableCryptos)
      availableCryptos = availableCryptos.map((item) => ({ name: item, symbol: '', info: 'crypto', icon: IconNEO })) //TODO, CHANGE IN THE API
      addData({ availableCryptos })

    }, [addData])

  const handleCryptoChange = useCallback(
    async (crypto?: string) => {

      let gateways = state.data.response_gateways.gateways

      if (!gateways) return
      if (state.data.availableCryptos.length <= 0) return

      const actualCrypto = crypto || state.data.availableCryptos[0].name //TODO: ADD SELECTEDCRYPTO -> crypto || state.data.SELECTEDCRYPTO || state.data.availableCryptos[0].name

      const filtredGatewaysByCrypto = gateways.filter((item: any) => item.supportedCrypto.includes(actualCrypto))

      let availableCurrencies: any[] = []
      for (var i in filtredGatewaysByCrypto) {
        availableCurrencies = availableCurrencies.concat(filtredGatewaysByCrypto[i].supportedCurrencies)
      }
      availableCurrencies = arrayUnique(availableCurrencies)
      availableCurrencies = availableCurrencies.map((item) => ({ name: item, symbol: '$', info: 'currency', icon: IconUSD })) //TODO: TEMP
      addData({ availableCurrencies, filtredGatewaysByCrypto })

    }, [state.data.response_gateways.gateways, state.data.availableCryptos, addData],
  )

  const handleCurrencyChange = useCallback(
    async (currency?: string) => {

      const filtredGatewaysByCrypto = state.data.filtredGatewaysByCrypto

      if (!filtredGatewaysByCrypto) return
      if (state.data.availableCurrencies.length <= 0) return

      const actualCurrency = currency || state.data.availableCurrencies[0].name //TODO: ADD SELECTEDCRYPTO -> crypto || state.data.SELECTEDCRYPTO || state.data.availableCryptos[0].name
      const filtredGatewaysByCurrency = filtredGatewaysByCrypto.filter((item: any) => item.supportedCurrencies.includes(actualCurrency))

      let availablePaymentMethods: any[] = []
      for (var i in filtredGatewaysByCurrency) {
        availablePaymentMethods = availablePaymentMethods.concat(filtredGatewaysByCurrency[i].paymentMethods)
      }

      availablePaymentMethods = arrayUnique(availablePaymentMethods)
      availablePaymentMethods = availablePaymentMethods.map((item) => ({ name: item, symbol: '', info: '', icon: IconCC })) //TODO: TEMP
      addData({ availablePaymentMethods, filtredGatewaysByCurrency })
    }, [addData, state.data.filtredGatewaysByCrypto, state.data.availableCurrencies],
  )

  const handlePaymentMethodChange = useCallback(
    async (paymentMehtod?: string) => {

      if (state.data.availablePaymentMethods.length <= 0) return

      const actualPaymentMethod = paymentMehtod || state.data.availablePaymentMethods[0].name//TODO: ADD SELECTEDCRYPTO -> crypto || state.data.SELECTEDCRYPTO || state.data.availableCryptos[0].name
      const actualAmount = state.collected.amount || 0

      const response_rate = await API.rate(
        state.data.availableCurrencies[state.collected.selectedCurrency].name,
        state.data.availableCryptos[state.collected.selectedCrypto].name,
        actualAmount,
        actualPaymentMethod
      )

      const filtredRatesByAviability = response_rate.filter((item: any) => item.available === true)
      const availableRates = filtredRatesByAviability.map((item: any) => ({
        ...item,
        name: item.identifier,
        txTime: item.duration.replace(' ' + item.duration.split(' ')[1], DATAS.TXTIMES_MAP[item.duration.split(' ')[1]]),
        kycLevel: `${item.requiredKYC.length}`,
        rate: item.rate,
        fee: (item.fees / state.collected.amount * 100),
        logo: LogoOnramper
      }))

      addData({ availableRates, response_rate, filtredRatesByAviability })
    }, [addData, state.collected.selectedCrypto, state.collected.selectedCurrency, state.data.availablePaymentMethods, state.collected.amount, state.data.availableCryptos, state.data.availableCurrencies])

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
        onCryptoChange: handleCryptoChange,
        onCurrencyChange: handleCurrencyChange,
        onPaymentMethodChange: handlePaymentMethodChange
      }
    }}>
      {props.children}
    </APIContext.Provider>
  )
}

export type DataActions = {
  type: CollectedActionsType.AddField;
  payload: {
    name: string
    value: number | string
  };
} | {
  type: CollectedActionsType.AddFile;
  payload: {
    name: string
    value: File[]
  };
} | {
  type: CollectedActionsType.DeleteFile;
  payload: {
    name: string
    value: string
  };
} | {
  type: DataActionsType.AddData;
  payload: {
    value: DataStateType
  };
}

const mainReducer = (state: StateType, action: DataActions) => ({
  ...state,
  collected: collectedReducer(state, action),
  data: dataReducer(state, action)
});

const collectedReducer = (state: StateType, action: DataActions) => {
  switch (action.type) {
    case CollectedActionsType.AddField:
      return {
        ...state.collected,
        [action.payload.name]: action.payload.value
      }
    case CollectedActionsType.AddFile:
      let newFiles = action.payload.value
      if (newFiles && newFiles.length > 0) {
        const existingFiles = (state.collected[action.payload.name] as File[]).map(f => f.name)
        newFiles = newFiles.filter(f => !existingFiles.includes(f.name))
      }
      return {
        ...state.collected,
        [action.payload.name]: [...state.collected[action.payload.name], ...newFiles]
      }
    case CollectedActionsType.DeleteFile:
      let name2delete = action.payload.value
      const newList = (state.collected[action.payload.name] as File[]).filter(f => f.name !== name2delete)
      return {
        ...state.collected,
        [action.payload.name]: [...newList]
      }
    default:
      return state.collected
  }
}

const dataReducer = (state: StateType, action: DataActions) => {
  switch (action.type) {
    case DataActionsType.AddData:
      return {
        ...state.data,
        ...action.payload.value
      }
    default:
      return state.data
  }
}

export { APIProvider, APIContext };