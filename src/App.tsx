import React, { useState } from 'react';
import ChooseGatewayView from './ChooseGatewayView'
import BuyCryptoView from './BuyCryptoView'
import PickCryptoScreen from './PickCryptoScreen'
import styles from './styles.module.css'
import { NavigationProvider } from './wrappers/Navigation'
import { AppProvider } from './wrappers/context';

import Header from './common/Header'

type screenType = {
  render: JSX.Element;
  status: number;
  effectIn: string;
  effectOut: string;
}

var steps = [
  {
    'render': <BuyCryptoView />,
    'status': 1,
    'effectIn': '',
    'effectOut': '',
  },
  {
    'render': <PickCryptoScreen />,
    'status': 0,
    'effectIn': '',
    'effectOut': '',
  },
  {
    'render': <ChooseGatewayView />,
    'status': 0,
    'effectIn': '',
    'effectOut': '',
  }
]

function App() {

  const [currentStep, setCurrentStep] = useState(1)
  const [navigationState, setNavigationState] = useState<screenType[]>([steps[0]])
  console.log("navigationState", navigationState)
  const [tittle, setTittle] = useState("hiii")


  return (
    <>
      <div className={`${styles.app}`}>
        {/* <NavigationProvider /> */}
        <button onClick={() => setTittle("ddd")} >change tittle</button>
        <Header backButton title={tittle} />
        <AppProvider>
          <BuyCryptoView />
        </AppProvider>
        {console.log('rerender', navigationState)}
        {/* <button onClick={() => { setNavigationState(old => [...old, steps[1]]) }}>add</button>
      <button onClick={() => { setNavigationState(old => [...old.slice(0, -1)]) }}>delete</button>
        {navigationState.map(screen => screen.render)}
       */}
      </div>
    </>
  );
}

type testState = {
  items: number[]
}

class Ddd extends React.Component<{}, testState> {
  constructor(props: any) {
    super(props);
    this.addItem = this.addItem.bind(this);

    this.state = {
      items: [1, 2, 3]
    }
  }

  addItem() {
    var items = this.state.items;
    items.push(4);
    this.setState({
      items: items
    })
  }
  render() {
    return (
      <div className={styles.App}>
        {
          this.state.items.map(function (i) {
            return <div className={styles.item}>Testing</div>
          })
        }
        <button onClick={this.addItem}>Add</button>
      </div>
    );
  }
}

export default App;
