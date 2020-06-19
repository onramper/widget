import React, { createContext, useReducer, /* Dispatch, */ useEffect } from 'react';

export type ScreenType = React.ReactNode;

export type NavigationStateType = {
    screens: ScreenType[];
}

export enum NavigationActionsType {
    Push = 'PUSH',
    Pop = 'POP'
}

export type NavigationActions = {
    type: NavigationActionsType.Push;
    screen: ScreenType;
} | {
    type: NavigationActionsType.Pop;
}

const initialState = { screens: [] }

//Creating context
const AppContext = createContext<{
  //state: NavigationStateType;
  backScreen: () => void;
  nextScreen: (screen: ScreenType) => void;
  //dispatch: Dispatch<NavigationActions>;
}>({
  //state: initialState,
  backScreen: () => null,
  nextScreen: () => null,
  //dispatch: () => null
});


//Creating context
const AppProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  const backScreen = () => dispatch({ type: NavigationActionsType.Pop })
  const nextScreen = (screen: ScreenType) => dispatch({ type: NavigationActionsType.Push, screen })

  useEffect(() => {
    dispatch({ type: NavigationActionsType.Push, screen: props.children })
  }, [props.children])

  return (
    <AppContext.Provider value={{ /* state, dispatch, */ backScreen, nextScreen }}>
      {state.screens.map((screen, i) => <span key={i}>{screen}</span>)}
    </AppContext.Provider>
  )
}

const mainReducer = (state: NavigationStateType, action: NavigationActions) => ({
  screens: navigationReducer(state, action),
});

const navigationReducer = (state: NavigationStateType, action: NavigationActions) => {
  switch (action.type) {
    case NavigationActionsType.Push:
      return [...state.screens, action.screen];
    case NavigationActionsType.Pop:
      return [...state.screens.slice(0, -1)];
  }
}

export { AppProvider, AppContext };
