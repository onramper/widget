import React, { createContext, useReducer } from 'react';
import styles from './styles.module.css'

export type ScreenType = React.ReactNode;

export type NavigationStateType = {
  screens: ScreenType[];
}

export enum NavigationActionsType {
  Only = 'ONLY',
  Push = 'PUSH',
  Pop = 'POP'
}

export type NavigationActions = {
  type: NavigationActionsType.Only;
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
  _state: NavigationStateType;
  onlyScreen: (screen: ScreenType) => void;
  backScreen: () => void;
  nextScreen: (screen: ScreenType) => void;
}>({
  _state: { screens: [] },
  onlyScreen: () => null,
  backScreen: () => null,
  nextScreen: () => null
});


//Creating context
const NavProvider: React.FC = (props) => {
  const [_state, dispatch] = useReducer(mainReducer, initialState);

  const backScreen = () => dispatch({ type: NavigationActionsType.Pop })
  const nextScreen = (screen: ScreenType) => dispatch({ type: NavigationActionsType.Push, screen })
  const onlyScreen = (screen: ScreenType) => dispatch({ type: NavigationActionsType.Only, screen })

  return (
    <NavContext.Provider value={{ _state, onlyScreen, backScreen, nextScreen }}>
      {props.children}
    </NavContext.Provider>
  )
}

class NavContainer extends React.Component<{ home?: ScreenType }, NavigationStateType> {
  constructor(props: { home?: ScreenType }) {
    super(props);

    this.state = { screens: [] };
  }

  componentDidMount() {
    const firstScreen = this.props.home
    if (firstScreen)
      this.context.onlyScreen(firstScreen)
  }

  render() {
    return (
      <NavContext.Consumer>
        {
          value =>
            <div className={styles['nav-container']} >
              {value._state.screens.map((screen, i) => (
                <div style={{ zIndex: (i + 1) }} className={styles.screen} key={i}>
                  {screen}
                </div>
              ))}
            </div>
        }
      </NavContext.Consumer>
    )
  }
}

NavContainer.contextType = NavContext

const mainReducer = (state: NavigationStateType, action: NavigationActions) => ({
  screens: navigationReducer(state, action),
});

const navigationReducer = (state: NavigationStateType, action: NavigationActions) => {
  const { screens } = state
  switch (action.type) {
    case NavigationActionsType.Only:
      return [action.screen];
    case NavigationActionsType.Push:
      return [...screens, action.screen];
    case NavigationActionsType.Pop:
      return [...screens.slice(0, -1)];
    default:
      return screens
  }
}

export { NavProvider, NavContext, NavContainer };
