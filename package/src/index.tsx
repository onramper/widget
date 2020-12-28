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
    defaultAmount?: number
    defaultCrypto?: string
    defaultFiat?: string
    defaultAddrs?: {
        [key: string]: string
    }
    onlyCryptos?: string[]
    excludeCryptos?: string[]
    onlyGateways?: string[]
    onlyFiat?: string[]
    className?: string
}

const OnramperWidget: React.FC<OnramperWidgetProps> = (props) => {
    const {
        color = '#31a5ff',
        defaultAddrs,
        defaultAmount,
        defaultFiat,
        defaultCrypto,
        onlyCryptos,
        excludeCryptos,
        onlyGateways,
        onlyFiat,
        className = ''
    } = props

    const style = {
        "--primary-color": color
    } as React.CSSProperties;

    return (
        <div style={style} className={`isolate-inheritance ${styles.theme} ${className}`}>
            <NavProvider>
                <APIProvider
                    API_KEY={props.API_KEY}
                    defaultAmount={defaultAmount}
                    defaultAddrs={defaultAddrs}
                    defaultCrypto={defaultCrypto}
                    defaultFiat={defaultFiat}
                    filters={{ onlyCryptos, excludeCryptos, onlyGateways, onlyFiat }}
                >
                    <div style={{ flexGrow: 1, display:'flex' }}>
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
