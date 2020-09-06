import React, { useState, useCallback } from 'react'
import styles from './styles.module.css'
import GatewayOption from './GatewayOption'
import { GatewayRateOption } from '../ApiContext'

interface RatesListProps {
    availableRates: GatewayRateOption[],
    unavailableRates: GatewayRateOption[],
    onItemClick?: (index: number) => void
}

const RatesList: React.FC<RatesListProps> = (props) => {
    const availableRates: GatewayRateOption[] = props.availableRates
    const unavailableRates: GatewayRateOption[] = props.unavailableRates
    const { onItemClick = () => null } = props

    const [selectedGatewayIndex, setSelectedGatewayIndex] = useState(0)

    const handleItemClick = useCallback((index: number) => {
        setSelectedGatewayIndex(index)
        onItemClick(index)
    }, [onItemClick])

    return (
        <div className={`${styles['rates-list']}`}>{/* TODO: change all custom lists to general list */}
            {
                availableRates.map((item, i) =>
                    <GatewayOption
                        key={i}
                        index={i}
                        isOpen={i === selectedGatewayIndex}
                        selectedReceivedCrypto={availableRates[selectedGatewayIndex].receivedCrypto}
                        onClick={handleItemClick}
                        {...item}
                    />
                )
            }
            {
                unavailableRates.map((item, i) =>
                    <GatewayOption
                        key={i}
                        index={i}
                        isOpen={false}
                        selectedReceivedCrypto={0}
                        {...item}
                    />
                )
            }
        </div>
    )
}

export default RatesList