import React from 'react';
import ReactDOM from 'react-dom'
import BuyCryptoView from './BuyCryptoView'
import styles from './styles.module.css'
import { NavProvider, NavContainer } from './NavContext';
import { APIProvider } from './ApiContext'
import type { APIProviderType } from './ApiContext'
import './polyfills/composedpath.polyfill'


import Footer from './common/Footer'

import './isolateinheritance.css'
import './normalize.min.css'

type OnramperWidgetProps = APIProviderType & { 
    color?: string
    fontFamily?: string
    className?: string
}

const OnramperWidget: React.FC<OnramperWidgetProps> = (props) => {
    const {
        color = '#266678',
        fontFamily = "'Roboto', sans-serif",
        className = '',
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
                    defaultAmount={props.defaultAmount}
                    defaultAddrs={props.defaultAddrs}
                    defaultCrypto={props.defaultCrypto}
                    defaultFiat={props.defaultFiat}
                    defaultFiatSoft={props.defaultFiatSoft}
                    defaultPaymentMethod={props.defaultPaymentMethod}
                    filters={props.filters}
                    country={props.country}
                    isAddressEditable={props.isAddressEditable}
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
