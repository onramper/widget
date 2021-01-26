import React from 'react';
import OnramperWidget from '@onramper/widget'

const com_key = 'pk_prod_trQ0nGBcmU_JY41N8Tl50Q00'
const dev_key = 'pk_test_oDsXkHokDdr06zZ0_sxJGw00'

const defaultApiKey =
  window.self !== window.top
    ? undefined
    : window.location.origin.split('.')[2] === 'com' ? com_key : dev_key

const apiKey = getParam('apiKey', defaultApiKey)
const defaultColor = `#${getParam('color', '266678')}`
const fontFamily = getParam('fontFamily')
const defaultAmount = Number(getParam('defaultAmount', '100'))
const defaultCrypto = getParam('defaultCrypto', 'BTC')
const defaultFiat = getParam('defaultFiat')
const defaultFiatSoft = getParam('defaultFiatSoft')
const defaultPaymentMethod = getParam('defaultPaymentMethod')
const addresses = JSON.parse(getParam('addresses', '{}') ?? '{}')
const onlyCryptos = getArrayParam('onlyCryptos')
const excludeCryptos = getArrayParam('excludeCryptos')
const onlyPaymentMethods = getArrayParam('onlyPaymentMethods')
const excludePaymentMethods = getArrayParam('excludePaymentMethods')
const excludeFiat = getArrayParam('excludeFiat')
const onlyGateways = getArrayParam('onlyGateways')
const onlyFiat = getArrayParam('onlyFiat')
const country = getParam('country')
const isAddressEditable = getParam('isAddressEditable', 'true')
const wallets = getWalletsParam()

function App() {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
        {/*         <div className={'onramper-pane'}></div> */}
        <div className={'widget-container'}>
          <OnramperWidget
            API_KEY={apiKey}
            color={defaultColor}
            fontFamily={fontFamily}
            defaultAddrs={wallets || addresses}
            defaultAmount={defaultAmount}
            defaultCrypto={defaultCrypto}
            defaultFiat={defaultFiat}
            defaultFiatSoft={defaultFiatSoft}
            defaultPaymentMethod={defaultPaymentMethod}
            onlyCryptos={onlyCryptos}
            excludeCryptos={excludeCryptos}
            onlyPaymentMethods={onlyPaymentMethods}
            excludePaymentMethods={excludePaymentMethods}
            excludeFiat={excludeFiat}
            onlyGateways={onlyGateways}
            onlyFiat={onlyFiat}
            country={country}
            isAddressEditable={isAddressEditable === 'true'}
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

function getArrayParam(paramName: string) {
  return getParam(paramName, undefined)?.split(',').map(code => code.trim())
}

function getWalletsParam() {
  return getParam('wallets', undefined)?.split(',').reduce((acc, wallet) => (
    {
      ...acc,
      [wallet.split(':')?.[0]]: wallet.split(':')?.[1]
    }
  ), {})
}

export default App;
