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
                items.filter((el) => el.available).map((item, i) =>
                    <GatewayOption
                        key={i}
                        index={i}
                        isOpen={i === selectedGateway}
                        onClick={handleItemClick}
                        selectedReceivedCrypto={items[selectedGateway].receivedCrypto}
                        name={item.name}
                        kycLevel={item.kycLevel}
                        rate={item.rate}
                        feePercent={item.feePercent}
                        fees={item.fees}
                        receivedCrypto={item.receivedCrypto}
                        nextStep={item.nextStep}
                        available={item.available}
                        txTime={item.txTime}
                        logo={item.logo}
                        error={item.error?.message} />
                )
            }
            {
                items.filter((el) => !el.available).map((item, i) =>
                    <GatewayOption
                        key={i}
                        index={i}
                        isOpen={i === selectedGateway}
                        onClick={handleItemClick}
                        selectedReceivedCrypto={items[selectedGateway].receivedCrypto}
                        name={item.name}
                        kycLevel={item.kycLevel}
                        rate={item.rate}
                        feePercent={item.feePercent}
                        fees={item.fees}
                        receivedCrypto={item.receivedCrypto}
                        nextStep={item.nextStep}
                        available={item.available}
                        txTime={item.txTime}
                        logo={item.logo}
                        error={item.error} />
                )
            }
        </div>
    )
}

export default GatewaysList