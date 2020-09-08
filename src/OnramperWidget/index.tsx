import React from 'react';
import BuyCryptoView from './BuyCryptoView'
import styles from './styles.module.css'
import { NavProvider, NavContainer } from './NavContext';
import { APIProvider } from './ApiContext'


type OnramperWidgetProps = {
    maxWidth?: string
    maxHeight?: string
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

const OnramperWidget: React.FC<OnramperWidgetProps> = ({ color, defaultAddrs, defaultAmount, defaultCrypto, filters, maxWidth, maxHeight }) => {
    var style = {
        "--primary-color": color,
        "--max-width": maxWidth,
        "--max-height": maxHeight
    } as React.CSSProperties;

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

export default (props: OnramperWidgetProps) => <OnramperWidget {...props} />;