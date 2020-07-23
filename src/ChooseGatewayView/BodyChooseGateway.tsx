import React from 'react'
import stylesCommon from '../styles.module.css'

import ButtonAction from '../common/ButtonAction'

import { GatewayOptionType } from './GatewayOption'

import GatewaysList from './GatewaysList'

type BodyChooseGatewayType = {
    onActionButton?: () => void,
    onItemClick?: (index: number) => void,
    availableGateways: GatewayOptionType[]
}

const BodyChooseGateway: React.FC<BodyChooseGatewayType> = (props) => {
    const { onActionButton, onItemClick } = props
    const { availableGateways } = props

    return (
        <main className={stylesCommon.body}>
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                <GatewaysList items={availableGateways} onItemClick={onItemClick} />
            </div>
            <div className={`${stylesCommon['body__child']}`}>
                <ButtonAction onClick={onActionButton} text='Continue' />
            </div>
        </main>
    )
}

export default BodyChooseGateway