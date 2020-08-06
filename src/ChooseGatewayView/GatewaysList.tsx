import React, { useState, useCallback } from 'react'
import styles from './styles.module.css'
import GatewayOption from './GatewayOption'
import { GatewayOptionType } from '../common/types'

interface GatewaysListProps {
    availableGateways: GatewayOptionType[],
    unavailableGateways: GatewayOptionType[],
    onItemClick?: (index: number) => void
}

const GatewaysList: React.FC<GatewaysListProps> = (props) => {
    const { availableGateways, unavailableGateways } = props //const
    const { onItemClick = () => null } = props

    const [selectedGatewayIndex, setSelectedGatewayIndex] = useState(0)

    const handleItemClick = useCallback((index: number) => {
        setSelectedGatewayIndex(index)
        onItemClick(index)
    }, [onItemClick])

    return (
        <div className={`${styles['gateways-list']}`}>{/* TODO: change all custom lists to general list */}
            {
                availableGateways.map((item, i) =>
                    <GatewayOption
                        key={i}
                        index={i}
                        isOpen={i === selectedGatewayIndex}
                        selectedReceivedCrypto={availableGateways[selectedGatewayIndex].receivedCrypto}
                        onClick={handleItemClick}

                        id={item.id}
                        name={item.name}
                        duration={item.duration}
                        available={item.available}
                        rate={item.rate}
                        fees={item.fees}
                        requiredKYC={item.requiredKYC}
                        receivedCrypto={item.receivedCrypto}
                        nextStep={item.nextStep}
                        logo={item.logo}
                    />
                )
            }
            {
                unavailableGateways.map((item, i) =>
                    <GatewayOption
                        key={i}
                        index={i}
                        isOpen={i === selectedGatewayIndex}
                        selectedReceivedCrypto={unavailableGateways[selectedGatewayIndex].receivedCrypto}

                        id={item.id}
                        name={item.name}
                        duration={item.duration}
                        available={item.available}
                        error={item.error}
                        logo={item.logo}
                    />
                )
            }
        </div>
    )
}

export default GatewaysList