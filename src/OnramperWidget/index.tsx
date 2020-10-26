import React from 'react';
import ReactDOM from 'react-dom'
import BuyCryptoView from './BuyCryptoView'
import styles from './styles.module.css'
import { NavProvider, NavContainer } from './NavContext';
import { APIProvider } from './ApiContext'


import Footer from './common/Footer'

import './normalize.min.css'

type OnramperWidgetProps = {
    color?: string
    defaultAmount?: number
    defaultCrypto?: string
    defaultAddrs?: {
        [key: string]: string[]
    }
    onlyCryptos?: string[]
    excludeCryptos?: string[]
    className?: string
}

const OnramperWidget: React.FC<OnramperWidgetProps> = (props) => {
    const { color = '#31a5ff', defaultAddrs = {}, defaultAmount = 100, defaultCrypto, onlyCryptos, excludeCryptos, className = '' } = props

    const style = {
        "--primary-color": color,
    } as React.CSSProperties;

    return (
        <div style={style} className={`${styles['theme']} ${className}`}>
            <NavProvider>
                <APIProvider defaultAmount={defaultAmount} defaultAddrs={defaultAddrs} defaultCrypto={defaultCrypto} filters={{ onlyCryptos, excludeCryptos }} >
                    <div style={{ flexGrow: 1 }}>
                        <NavContainer home={<BuyCryptoView />} />
                    </div>
                    <Footer />
                </APIProvider>
            </NavProvider>
        </div>
    )
}

const initialize = (selector: string, props: OnramperWidgetProps) => {
    let domContainer = document.querySelector(selector);
    ReactDOM.render(<OnramperWidget {...props} />, domContainer);
}

export default (props: OnramperWidgetProps) => <OnramperWidget {...props} />;
export { initialize }