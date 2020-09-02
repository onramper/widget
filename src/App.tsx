import React from 'react';
import BuyCryptoView from './BuyCryptoView'
import styles from './styles.module.css'
import { NavProvider, NavContainer } from './NavContext';
import { APIProvider } from './ApiContext'

const defaultAddrs = JSON.stringify({
  BTC: ['btcAddr1', 'btcAddr2'],
  ETH: ['0xab0aFC6F0c1d3b2E0F3650eE9b92e1C6F0098bC1'],
  NEO: ['neoAddr1', 'neoAddr2', 'neoAddr3', 'neoAddr4']
})

const defaultColor = `#${getParam('color', '31a5ff')}`
const defaultAmount = Number(getParam('defaultAmount', '100'))
const defaultCrypto = getParam('defaultCrypto', '')
const addresses = JSON.parse(getParam('addresses', defaultAddrs) ?? JSON.stringify({}))
const onlyCryptos = getParam('onlyCryptos', undefined)?.split(',').map(code => code.trim())
const excludeCryptos = getParam('excludeCryptos', undefined)?.split(',').map(code => code.trim())
const filters = { onlyCryptos, excludeCryptos }

function App() {
  return (
    <>
      <div style={{ display: 'flex', height: '100%' }}>
        <div className={`${styles['views-container']}`}>
          <OnramperWidget color={defaultColor} defaultAddrs={addresses} defaultAmount={defaultAmount} defaultCrypto={defaultCrypto} filters={filters} />
        </div>
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
  filters?: {
    onlyCryptos?: string[]
    excludeCryptos?: string[]
  }
}

const OnramperWidget: React.FC<OnramperWidgetProps> = ({ color, defaultAddrs, defaultAmount, defaultCrypto, filters }) => {
  var style = { "--primary-color": color } as React.CSSProperties;
  return (
    <div style={style} className={`${styles['theme']}`}>
      <APIProvider defaultAmount={defaultAmount} defaultAddrs={defaultAddrs} defaultCrypto={defaultCrypto} filters={filters} >
        <NavProvider>
          <NavContainer home={<BuyCryptoView />} />
        </NavProvider>
      </APIProvider>
    </div>
  )
}

function getParam(name: string, defaultValue?: string): string | undefined {
  const value = new URLSearchParams(window.location.search).get(name)
  if (value === null) {
    if (defaultValue !== undefined) {
      return defaultValue
    } else {
      //throw new Error(`Parameter ${name} has not been provided in the query string`)
      return undefined
    }
  }
  return value
}

export default App;
