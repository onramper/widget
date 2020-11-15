import React, { createContext, useReducer, useCallback } from 'react';
import styles from './styles.module.css'
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export type ScreenType = React.ReactNode;

export type NavigationStateType = {
  screens: ScreenType[];
}

export enum NavigationActionsType {
  Only = 'ONLY',
  Push = 'PUSH',
  Pop = 'POP',
  Replace = 'REPLACE'
}

export type NavigationActions = {
  type: NavigationActionsType.Only;
  screen: ScreenType;
} | {
  type: NavigationActionsType.Push;
  screen: ScreenType;
} | {
  type: NavigationActionsType.Pop;
} | {
  type: NavigationActionsType.Replace;
  screen: ScreenType;
}

const initialState = { screens: [] }

//Creating context
const NavContext = createContext<{
  _state: NavigationStateType;
  onlyScreen: (screen: ScreenType) => void;
  backScreen: () => void;
  nextScreen: (screen: ScreenType) => void;
  replaceScreen: (screen: ScreenType) => void;
}>({
  _state: initialState,
  onlyScreen: () => null,
  backScreen: () => null,
  nextScreen: () => null,
  replaceScreen: () => null
});


//Creating context
const NavProvider: React.FC = (props) => {
  const [_state, dispatch] = useReducer(mainReducer, initialState);

  const backScreen = useCallback(() => dispatch({ type: NavigationActionsType.Pop }), [])
  const nextScreen = useCallback((screen: ScreenType) => dispatch({ type: NavigationActionsType.Push, screen }), [])
  const onlyScreen = useCallback((screen: ScreenType) => dispatch({ type: NavigationActionsType.Only, screen }), [])
  const replaceScreen = useCallback((screen: ScreenType) => dispatch({ type: NavigationActionsType.Replace, screen }), [])

  return (
    <NavContext.Provider value={{ _state, onlyScreen, backScreen, nextScreen, replaceScreen }}>
      {props.children}
    </NavContext.Provider>
  )
}

class NavContainer extends React.Component<{ home?: ScreenType }, NavigationStateType & { _isChatOpen: boolean, intro: boolean }> {
  private transitionRef: React.RefObject<any>;
  private iframeRef: React.RefObject<HTMLIFrameElement>;
  private timer: ReturnType<typeof setTimeout> | null
  constructor(props: { home?: ScreenType }) {
    super(props);

    this.state = {
      ...initialState,
      _isChatOpen: false,
      intro: true,
    };
    this.transitionRef = React.createRef()
    this.iframeRef = React.createRef()
    this.timer = null
  }

  componentDidMount() {
    const firstScreen = this.props.home
    if (firstScreen)
      this.context.onlyScreen(firstScreen)

    this.timer = setInterval(
      () => {
        this.setState({ intro: false })
      },
      2200,
    );
  }

  componentWillUnmount() {
    if (this.timer)
      clearInterval(this.timer);
  }

  render() {
    return (
      <NavContext.Consumer>
        {
          value =>
            <div className={styles['nav-container']} >
              <TransitionGroup>
                {value._state.screens.map((screen, i) => (
                  <CSSTransition key={i} nodeRef={this.transitionRef} timeout={200} classNames={{
                    enter: styles['screen-enter'],
                    enterActive: styles['screen-enter-active'],
                    exit: styles['screen-exit'],
                    exitActive: styles['screen-exit-active']
                  }}>
                    <div style={{ zIndex: (i + 1) }} className={styles.screen} ref={this.transitionRef}>
                      {screen}
                    </div>
                  </CSSTransition>
                ))}
              </TransitionGroup>
              <CSSTransition
                onEnter={() => {
                  if (this.iframeRef.current)
                    this.iframeRef.current.style.display = 'block'
                }}
                onExited={() => {
                  if (this.iframeRef.current)
                    this.iframeRef.current.style.display = 'none'
                }}
                in={this.state._isChatOpen}
                timeout={200}
                classNames={{
                  enter: styles['screen-enter'],
                  enterActive: styles['screen-enter-active'],
                  exit: styles['screen-exit'],
                  exitActive: styles['screen-exit-active']
                }}>
                <iframe
                  ref={this.iframeRef}
                  frameBorder="0"
                  title="Helper chat"
                  src="https://tawk.to/chat/5faec5a2c52f660e8973425f/default"
                  className={styles.floating}
                />
              </CSSTransition>
              <div className={`${styles["chat"]} ${this.state._isChatOpen ? styles["active"] : ''} ${!this.state.intro ? styles['shy'] : 'hi'}`} onClick={(e) => {
                e.preventDefault()
                this.setState(prevState => ({ _isChatOpen: !prevState._isChatOpen }))
              }}>
                <div className={styles["background"]}><span onClick={(e)=>e.preventDefault()} className={styles["background-text"]}>Do you need help?</span></div>
                <svg className={styles["chat-bubble"]} width="46.875" height="46.875" viewBox="12.5 12.5 75 75">
                  <g className={styles["bubble"]}>
                    <path className={`${styles["line"]} ${styles["line1"]}`} d="M 30.7873,85.113394 30.7873,46.556405 C 30.7873,41.101961
          36.826342,35.342 40.898074,35.342 H 59.113981 C 63.73287,35.342
          69.29995,40.103201 69.29995,46.784744" />
                    <path className={`${styles["line"]} ${styles["line2"]}`} d="M 13.461999,65.039335 H 58.028684 C
            63.483128,65.039335
            69.243089,59.000293 69.243089,54.928561 V 45.605853 C
            69.243089,40.986964 65.02087,35.419884 58.339327,35.419884" />
                  </g>
                  <circle className={`${styles["circle"]} ${styles["circle1"]}`} r="1.9" cy="50.7" cx="42.5" />
                  <circle className={`${styles["circle"]} ${styles["circle2"]}`} cx="49.9" cy="50.7" r="1.9" />
                  <circle className={`${styles["circle"]} ${styles["circle"]}`} r="1.9" cy="50.7" cx="57.3" />
                </svg>
              </div>
              {/*               <button
                onClick={(e) => {
                  e.preventDefault()
                  console.log(this.state._isChatOpen)
                  this.setState(prevState => ({ _isChatOpen: !prevState._isChatOpen }))
                }}
                style={{
                  position: 'absolute',
                  backgroundColor: 'red',
                  zIndex: 999,
                  bottom: 0,
                  right: 0
                }}>Need help?</button> */}
            </div>
        }
      </NavContext.Consumer>
    )
  }
}

NavContainer.contextType = NavContext

const mainReducer = (state: NavigationStateType, action: NavigationActions) => ({
  screens: navigationReducer(state, action)
});

const navigationReducer = (state: NavigationStateType, action: NavigationActions) => {
  const { screens } = state
  switch (action.type) {
    case NavigationActionsType.Only:
      return [action.screen];
    case NavigationActionsType.Push:
      return [...screens, action.screen];
    case NavigationActionsType.Pop:
      if (screens.length <= 1) return screens
      return [...screens.slice(0, -1)];
    case NavigationActionsType.Replace:
      return [...screens.slice(0, -1), action.screen];
    default:
      return screens
  }
}

export { NavProvider, NavContext, NavContainer };
