import React from 'react';
import ReactDOM from 'react-dom'
import BuyCryptoView from './BuyCryptoView'
import styles from './styles.module.css'
import { NavProvider, NavContainer } from './NavContext';
import { APIProvider } from './ApiContext'
import './polyfills/composedpath.polyfill'


import Footer from './common/Footer'

import './isolateinheritance.css'
import './normalize.min.css'

type OnramperWidgetProps = {
    API_KEY?: string,
    color?: string
    fontFamily?: string
    defaultAmount?: number
    defaultCrypto?: string
    defaultFiat?: string
    defaultFiatSoft?: string
    defaultPaymentMethod?: string
    defaultAddrs?: {
        [key: string]: string
    }
    onlyCryptos?: string[]
    excludeCryptos?: string[]
    onlyPaymentMethods?: string[]
    excludePaymentMethods?: string[]
    excludeFiat?: string[]
    onlyGateways?: string[]
    onlyFiat?: string[]
    className?: string
    country?: string
    isAddressEditable?: boolean
}

const OnramperWidget: React.FC<OnramperWidgetProps> = (props) => {
    const {
        color = '#266678',
        fontFamily = "'Roboto', sans-serif",
        defaultAddrs,
        defaultAmount,
        defaultFiat,
        defaultFiatSoft,
        defaultCrypto,
        onlyCryptos,
        excludeCryptos,
        onlyPaymentMethods,
        excludePaymentMethods,
        excludeFiat,
        onlyGateways,
        onlyFiat,
        className = '',
        country,
        defaultPaymentMethod,
        isAddressEditable
    } = props

    const style = {
        "--primary-color": color,
        "--font-family": fontFamily
    } as React.CSSProperties;

    return (
        <div id="main" style={style} className={`isolate-inheritance ${styles.theme} ${className}`}>
            <NavProvider>
                <APIProvider
                    API_KEY={props.API_KEY}
                    defaultAmount={defaultAmount}
                    defaultAddrs={defaultAddrs}
                    defaultCrypto={defaultCrypto}
                    defaultFiat={defaultFiat}
                    defaultFiatSoft={defaultFiatSoft}
                    defaultPaymentMethod={defaultPaymentMethod}
                    filters={{ onlyCryptos, excludeCryptos, excludeFiat, onlyGateways, onlyFiat, onlyPaymentMethods, excludePaymentMethods }}
                    country={country}
                    isAddressEditable={isAddressEditable}
                >
                    <div style={{ flexGrow: 1, display: 'flex' }}>
                        <NavContainer home={<BuyCryptoView />} />
                    </div>
                    <Footer />
                </APIProvider>
            </NavProvider>
        </div>
    )
}

const initialize = (selector: string, props: OnramperWidgetProps) => {
    const domContainer = document.querySelector(selector);
    ReactDOM.render(<OnramperWidget {...props} />, domContainer);
}

export default (props: OnramperWidgetProps) => <OnramperWidget {...props} />;
export { initialize }
