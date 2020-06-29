import React, { useState, useCallback } from 'react'
import styles from './styles.module.css'
import GatewayOption, { GatewayOptionType } from './GatewayOption'

type GatewaysListType = {
    items: Omit<GatewayOptionType, 'index'>[],
    onItemClick?: (index: number) => void
}

const GatewaysList: React.FC<GatewaysListType> = (props) => {
    const { items } = props //const
    const { onItemClick = () => null } = props

    const [selectedGateway, setSelectedGateway] = useState(0)

    const handleItemClick = useCallback((index: number) => {
        setSelectedGateway(index)
        onItemClick(index)
    }, [onItemClick])

    return (
        <div className={`${styles['gateways-list']}`}>{/* TODO: change all custom lists to general list */}
            {
                items.map((item, i) =>
                    <GatewayOption
                        key={i}
                        index={i}
                        name={item.name}
                        txTime={item.txTime}
                        kycLevel={item.kycLevel}
                        amount={item.amount}
                        denom={item.denom}
                        fee={item.fee}
                        logo={item.logo}
                        isOpen={i === selectedGateway}
                        onClick={handleItemClick}
                        selectedAmount={items[selectedGateway].amount} />
                )
            }
        </div>
    )
}

export default GatewaysList