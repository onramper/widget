import React from 'react'
import styles from '../styles.module.css'
import GatewayOption, { GatewayOptionType } from './GatewayOption'

function GatewaysList(props: { items: GatewayOptionType[], onClick: (...args: any) => void }) {
    var { items } = props //const

    const listItems = items.map((item, i) =>
        <GatewayOption
            key={i}
            name={item.name}
            txTime={item.txTime}
            kycLevel={item.kycLevel}
            amount={item.amount}
            denom={item.denom}
            fee={item.fee}
            logo={item.logo}
            open={item.open} />
    );

    return (
        <main className={`${styles.body} ${styles['gateways-list']}`}>{/* TODO: change all custom lists to general list */}
            {listItems}
        </main>
    )
}

export default GatewaysList