import React, { createContext, useReducer, useCallback } from 'react';
import { ListItemType } from '../common/types'
import { GatewayOptionType } from '../ChooseGatewayView/GatewayOption'

import {
  getExpectedCrypto,
  getData
} from '../api/api'


/* QUERY PARAMS */
export enum QueryParams {
  Amount = 'amount',
  Denom = 'denom',
  Currency = 'currency',
  PaymentMethod = 'paymentMethod'
}

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
  availableGateways: GatewayOptionType[]
}

type DataInterfaceType = {
  addData: (data: DataStateType) => void
}

type InputInterfaceType = {
  collectData: (name: string, value: any) => void
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleFilesAdded: (name: string, files: File[], maxFiles: number) => boolean,
  handleFileDeleted: (name: string, fileName: string) => void
}

type RemoteType = {
  getExpectedCrypto: (amount: number) => Promise<number>
  getData: () => Promise<DataStateType>,
}

type StateType = {
  data: DataStateType,
  collected: CollectedStateType
  inputInterface: InputInterfaceType
  dataInterface: DataInterfaceType
  remote: RemoteType
}

const initialState = {
  data: {
    availableCryptos: [],
    availableCurrencies: [],
    availablePaymentMethods: [],
    availableGateways: []
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
    collectData: () => null,
    handleInputChange: () => null,
    handleFilesAdded: () => true,
    handleFileDeleted: () => null,
    //todo: split remote and local and add files
  },
  dataInterface: {
    addData: (data: DataStateType) => null
  },
  remote: {
    getExpectedCrypto: getExpectedCrypto,//add api calls
    getData: getData
  }
}

enum CollectedActionsType {
  AddField = 'ADD_FIELD',
  AddFile = 'ADD_FILE',
  DeleteFile = 'DELETE_FILE'
}

enum DataActionsType {
  AddData = 'ADD_DATA'
}

//Creating context
const APIContext = createContext<StateType>(initialState);


const APIProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  /*   const collectData = useCallback(
      (i: number) => dispatch({ type: CollectedActionsType.AddField, payload: { name: 'selectedGateway', value: i } }),
      [],
    ) */

  const collectData = useCallback(
    (name: string, value: number) => dispatch({ type: CollectedActionsType.AddField, payload: { name, value } }),
    [],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => dispatch({ type: CollectedActionsType.AddField, payload: { name: e.target.name, value: e.target.value } }),
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
    (data: DataStateType) => dispatch({ type: DataActionsType.AddData, payload: { value: data } }),
    [],
  )

  return (
    <APIContext.Provider value={{
      ...state,
      inputInterface: {
        collectData,
        handleInputChange,
        handleFilesAdded,
        handleFileDeleted
      },
      dataInterface: {
        addData
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
