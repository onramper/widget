import React from 'react';
import OnramperWidget from './OnramperWidget'

const defaultAddrs = JSON.stringify({
  BTC: 'btcAddr1',
  ETH: '0xab0aFC6F0c1d3b2E0F3650eE9b92e1C6F0098bC1',
  NEO: 'neoAddr1'
})

const apiKey = getParam('apiKey', undefined)
const defaultColor = `#${getParam('color', '266678')}`
const defaultAmount = Number(getParam('defaultAmount', '100'))
const defaultCrypto = getParam('defaultCrypto', 'BTC')
const addresses = JSON.parse(getParam('addresses', defaultAddrs) ?? JSON.stringify({}))
const onlyCryptos = getParam('onlyCryptos', undefined)?.split(',').map(code => code.trim())
const excludeCryptos = getParam('excludeCryptos', undefined)?.split(',').map(code => code.trim())

function App() {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
        {/*         <div className={'onramper-pane'}></div> */}
        <div className={'widget-container'}>
          <OnramperWidget
            API_KEY={apiKey}
            color={defaultColor}
            defaultAddrs={addresses}
            defaultAmount={defaultAmount}
            defaultCrypto={defaultCrypto}
            onlyCryptos={onlyCryptos}
            excludeCryptos={excludeCryptos}
          />
        </div>
      </div>
    </>
  );
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
