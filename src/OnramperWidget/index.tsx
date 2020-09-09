import React from 'react';
import BuyCryptoView from './BuyCryptoView'
import styles from './styles.module.css'
import { NavProvider, NavContainer } from './NavContext';
import { APIProvider } from './ApiContext'


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
    const { color = '#31a5ff', defaultAddrs = {}, defaultAmount = 100, defaultCrypto, onlyCryptos, excludeCryptos, className='' } = props

    const style = {
        "--primary-color": color,
    } as React.CSSProperties;

    return (
        <div style={style} className={`${styles['theme']} ${className}`}>
            <APIProvider defaultAmount={defaultAmount} defaultAddrs={defaultAddrs} defaultCrypto={defaultCrypto} filters={{ onlyCryptos, excludeCryptos }} >
                <NavProvider>
                    <NavContainer home={<BuyCryptoView />} />
                </NavProvider>
            </APIProvider>
        </div>
    )
}

export default (props: OnramperWidgetProps) => <OnramperWidget {...props} />;