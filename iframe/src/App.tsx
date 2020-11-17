import React from 'react';
import OnramperWidget from '@onramper/widget'

const com_key = process.env.STAGE === 'prod' ? 'pk_prod_5_mIrIKzxaFzgVpVMGuXmg00' : 'pk_test_5_mIrIKzxaFzgVpVMGuXmg00'
const dev_key = process.env.STAGE === 'prod' ? 'pk_prod_4uEw2wi1UN77IgsFAjbCLQ00' : 'pk_test_4uEw2wi1UN77IgsFAjbCLQ00'

const defaultApiKey =
  window.self !== window.top
    ? undefined
    : window.location.href.split('.')[1] === 'com' ? com_key : dev_key

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
