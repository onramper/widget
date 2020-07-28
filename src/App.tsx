import React, { useState } from 'react';
import BuyCryptoView from './BuyCryptoView'
import styles from './styles.module.css'
import { NavProvider, NavContainer } from './wrappers/context';
import { APIProvider } from './context'

const defaultColor = '#31a5ff'
const defaultAddrs = {
  BTC: ['btcAddr1', 'btcAddr2'],
  ETH: ['ethAddr1'],
  NEO: ['neoAddr1', 'neoAddr2', 'neoAddr3', 'neoAddr4']
}
const defaultAmount = 100
const defaultCrypto = ''

function App() {
  const [color, setColor] = useState(defaultColor)
  return (
    <>
      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      <div className={`${styles['views-container']}`}>
        <OnramperWidget color={color} defaultAddrs={defaultAddrs} defaultAmount={defaultAmount} defaultCrypto={defaultCrypto} />
      </div>
    </>
  );
}

type OnramperWidgetProps = {
  color?: string
  defaultAmount?: number
  defaultCrypto?: string
  defaultAddrs?: {
    [key: string]: string[]
  }
}

const OnramperWidget: React.FC<OnramperWidgetProps> = ({ color, defaultAddrs, defaultAmount, defaultCrypto }) => {
  var style = { "--primary-color": color } as React.CSSProperties;
  return (
    <div style={style} className={`${styles['theme']}`}>
      <APIProvider defaultAmount={defaultAmount} defaultAddrs={defaultAddrs} defaultCrypto={defaultCrypto} >
        <NavProvider>
          <NavContainer home={<BuyCryptoView />} />
        </NavProvider>
      </APIProvider>
    </div>
  )
}

export default App;
