import React from 'react'
import styles from '../styles.module.css'
import GatewayOption, { GatewayOptionType } from './GatewayOption'

function GatewaysList(props: { items: GatewayOptionType[], onClick: (...args: any) => void }) {
    var { items } = props //const

    const listItems = items.map((item) =>
        <GatewayOption
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
        <div className={`${styles.body} ${styles['gateways-list']}`}>{/* TODO: change all custom lists to general list */}
            {listItems}
        </div>
    )
}

export default GatewaysList