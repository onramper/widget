import React, { createContext, useReducer } from 'react';
import { ListItemType } from '../common/types'
import IconBTC from '../icons/btc.svg'
import IconUSD from '../icons/usd.svg'
import IconCC from '../icons/ccs.svg'


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
  paymentMethod: string
}

/* ___________ */

type DataStateType = {
  aviableCryptos: ListItemType[],
  aviableCurrencies: ListItemType[],
  aviablePaymentMethods: ListItemType[],
}

type ApiType = {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

type StateType = {
  data: DataStateType,
  collected: CollectedStateType
  api: ApiType
}
//test data
const availableCryptos = [
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
    paymentMethod: 'default'
  },
  api: {
    handleInputChange: () => null
  }
}

enum CollectedActionsType {
  AddField = 'ADD_FIELD'
}

//Creating context
const APIContext = createContext<StateType>(initialState);


const APIProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch({ type: CollectedActionsType.AddField, payload: { state, name: e.target.name, value: e.target.value } })

  return (
    <APIContext.Provider value={{ ...state, api: { ...state.api, handleInputChange: handleInputChange } }}>
      {props.children}
    </APIContext.Provider>
  )
}

const mainReducer = (state: StateType, action: DataActions) => ({
  ...state,
  collected: collectedReducer(state, action)
});

type DataActions = {
  type: CollectedActionsType.AddField;
  payload: {
    state: StateType
    name: string
    value: number | string
  };
}

const collectedReducer = (state: StateType, action: DataActions) => {
  console.log(state)
  const { payload } = action
  switch (action.type) {
    case CollectedActionsType.AddField:
      return {
        ...payload.state.collected,
        [payload.name]: payload.value
      }
    default:
      return state.collected
  }
}

export { APIProvider, APIContext };
