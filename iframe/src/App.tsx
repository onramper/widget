import React from 'react';
import OnramperWidget from '@onramper/widget'

const com_key = process.env.REACT_APP_STAGE === 'production' ? 'pk_prod_trQ0nGBcmU_JY41N8Tl50Q00' : 'pk_test_trQ0nGBcmU_JY41N8Tl50Q00'
const dev_key = process.env.REACT_APP_STAGE === 'production' ? 'pk_prod_oDsXkHokDdr06zZ0_sxJGw00' : 'pk_test_oDsXkHokDdr06zZ0_sxJGw00'
console.log(process.env.STAGE, process.env.NODE_ENV, process.env.REACT_APP_STAGE)

const defaultApiKey =
  window.self !== window.top
    ? undefined
    : window.location.origin.split('.')[2] === 'com' ? com_key : dev_key

const apiKey = getParam('apiKey', defaultApiKey)
const defaultColor = `#${getParam('color', '266678')}`
const defaultAmount = Number(getParam('defaultAmount', '100'))
const defaultCrypto = getParam('defaultCrypto', 'BTC')
const addresses = JSON.parse(getParam('addresses', '{}') ?? '{}')
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
