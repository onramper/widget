import React, { createContext, useReducer, Dispatch, useEffect, useState } from 'react';
import { shoppingCartReducer, ShoppingCartActions, Types } from './reducers';
import PickCryptoScreen from '../PickCryptoScreen'
import Header from '../common/Header'

type NavigationStateType = {
  screens: React.ReactNode[];
}

const initialState = {
  screens: [],
}

const AppContext = createContext<{
  state: NavigationStateType;
  dispatch: Dispatch<ShoppingCartActions>;
}>({
  state: initialState,
  dispatch: () => null
});

const mainReducer = ({ screens }: NavigationStateType, action: ShoppingCartActions) => ({
  screens: shoppingCartReducer(screens, action),
});


const AppProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);
  const [tittle, setTittle] = useState("hiii")
  console.log('state', state)
  useEffect(() => {
    dispatch({ type: Types.Push, screen: props.children })
  }, [props.children])
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <button onClick={() => dispatch({ type: Types.Push, screen: <Header backButton title={tittle} /> })} >add</button>
      <button onClick={() => dispatch({ type: Types.Pop })} >back</button>
      <button onClick={() => setTittle("ddd")} >change tittle</button>
      {state.screens.map(screen => screen)}
    </AppContext.Provider>
  )
}

export { AppProvider, AppContext };
