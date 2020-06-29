import React, { createContext, useReducer } from 'react';
import { ListItemType } from '../common/types'
import IconBTC from '../icons/btc.svg'
import IconUSD from '../icons/usd.svg'
import IconCC from '../icons/ccs.svg'

import { getExpectedCrypto } from '../api/api'


/* QUERY PARAMS */
export enum QueryParams {
  Amount = 'amount',
  Denom = 'denom',
  Currency = 'currency',
  PaymentMethod = 'paymentMethod'
}

type CollectedStateType = {
  amount: number,
  denom: string,
  currency: string,
  paymentMethod: string,
  "files-id": File[],
  [key: string]: any
}

/* ___________ */

type DataStateType = {
  aviableCryptos: ListItemType[],
  aviableCurrencies: ListItemType[],
  aviablePaymentMethods: ListItemType[],
}

type ApiType = {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleFilesAdded: (name: string, files: File[], maxFiles: number) => boolean,
  handleFileDeleted: (name: string, fileName: string) => void
}

type RemoteType = {
  getExpectedCrypto: (amount: number) => Promise<number>
}

type StateType = {
  data: DataStateType,
  collected: CollectedStateType
  api: ApiType
  remote: RemoteType
}
//test data
const availableCryptos = [
  {
    icon: IconBTC,
    name: "BTC",
    info: "Bitcoin"
  },
  {
    icon: IconBTC,
    name: "BTC",
    info: "Bitcoin"
  },
  {
    icon: IconBTC,
    name: "BTC",
    info: "Bitcoin"
  },
  {
    icon: IconBTC,
    name: "BTC",
    info: "Bitcoin"
  },
  {
    icon: IconBTC,
    name: "BTC",
    info: "Bitcoin"
  }
]

const aviableCurrencies = [
  {
    icon: IconUSD,
    name: "USD",
    info: "US Dollar"
  },
]

const aviablePaymentMethods = [
  {
    icon: IconCC,
    name: "Credit card"
  },
]

const initialState = {
  data: {
    aviableCryptos: availableCryptos,//[]
    aviableCurrencies: aviableCurrencies,//[]
    aviablePaymentMethods: aviablePaymentMethods,//[]
  },
  collected: {
    amount: 100,
    denom: 'default',
    currency: 'default',
    paymentMethod: 'default',
    'files-id': []
  },
  api: {
    handleInputChange: () => null,
    handleFilesAdded: () => true,
    handleFileDeleted: () => null
  },
  remote: {
    getExpectedCrypto: getExpectedCrypto//add api calls
  }
}

enum CollectedActionsType {
  AddField = 'ADD_FIELD',
  AddFile = 'ADD_FILE',
  DeleteFile = 'DELETE_FILE'
}

//Creating context
const APIContext = createContext<StateType>(initialState);


const APIProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch({ type: CollectedActionsType.AddField, payload: { name: e.target.name, value: e.target.value } })
  const handleFilesAdded = (name: string, files: File[], maxFiles: number) => {
    const existingFiles = state.collected["files-id"].map(f => f.name)
    files = files.filter(f => !existingFiles.includes(f.name))
    if (existingFiles.length + files.length > maxFiles) return false
    dispatch({ type: CollectedActionsType.AddFile, payload: { name, value: files } })
    return true;
  }
  const handleFileDeleted = (name: string, fileName: string) => dispatch({ type: CollectedActionsType.DeleteFile, payload: { name, value: fileName } })


  return (
    <APIContext.Provider value={{ ...state, api: { ...state.api, handleInputChange, handleFilesAdded, handleFileDeleted } }}>
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
}

const mainReducer = (state: StateType, action: DataActions) => ({
  ...state,
  collected: collectedReducer(state, action)
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

export { APIProvider, APIContext };
