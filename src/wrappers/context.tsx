import React, { createContext, useReducer, /* Dispatch, */ useEffect } from 'react';

export type ScreenType = React.ReactNode;

export type NavigationStateType = {
  screens: ScreenType[];
}

export enum NavigationActionsType {
  Setup = 'SETUP',
  Push = 'PUSH',
  Pop = 'POP'
}

export type NavigationActions = {
  type: NavigationActionsType.Setup;
  screen: ScreenType;
} | {
  type: NavigationActionsType.Push;
  screen: ScreenType;
} | {
  type: NavigationActionsType.Pop;
}

const initialState = { screens: [] }

//Creating context
const NavContext = createContext<{
  backScreen: () => void;
  nextScreen: (screen: ScreenType) => void;
}>({
  backScreen: () => null,
  nextScreen: () => null
});


//Creating context
const NavProvider: React.FC<{ home: ScreenType }> = (props) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  const backScreen = () => dispatch({ type: NavigationActionsType.Pop })
  const nextScreen = (screen: ScreenType) => dispatch({ type: NavigationActionsType.Push, screen })

  const firstScreen = props.home

  useEffect(() => {
    dispatch({ type: NavigationActionsType.Setup, screen: firstScreen })
  }, [firstScreen])

  return (
    <NavContext.Provider value={{ backScreen, nextScreen }}>
      {state.screens.map((screen, i) => <React.Fragment key={i}>{screen}</React.Fragment>)}
    </NavContext.Provider>
  )
}

const mainReducer = (state: NavigationStateType, action: NavigationActions) => ({
  screens: navigationReducer(state, action),
});

const navigationReducer = (state: NavigationStateType, action: NavigationActions) => {
  const { screens } = state
  switch (action.type) {
    case NavigationActionsType.Setup:
      if (screens.length === 0)
        return [action.screen];
      else
        return screens
    case NavigationActionsType.Push:
      return [...screens, action.screen];
    case NavigationActionsType.Pop:
      return [...screens.slice(0, -1)];
  }
}

export { NavProvider, NavContext };
