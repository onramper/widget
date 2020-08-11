import React from 'react'
import stylesCommon from '../styles.module.css'

import ButtonAction from '../common/ButtonAction'

import { GatewayOptionType } from '../common/types'
import InfoBox from '../common/InfoBox'

import GatewaysList from './GatewaysList'

type BodyChooseGatewayType = {
    onActionButton?: () => void,
    onItemClick?: (index: number) => void,
    gatewaysList: GatewayOptionType[]
}

const BodyChooseGateway: React.FC<BodyChooseGatewayType> = (props) => {
    const { onActionButton, onItemClick } = props
    const { gatewaysList } = props

    const availableGateways = gatewaysList.filter((el) => el.available)
    const unavailableGateways = gatewaysList.filter((el) => !el.available)

    return (
        <main className={stylesCommon.body}>
            {gatewaysList.length > 0 ?
                <div className={`${stylesCommon['body__child']}`}>
                    <GatewaysList availableGateways={availableGateways} unavailableGateways={unavailableGateways} onItemClick={onItemClick} />
                </div>
                : (
                    <InfoBox in={true} type='info' className={`${stylesCommon['body__child']}`}>
                        Something went wrong, try again.
                    </InfoBox>
                )
            }
            <div className={`${stylesCommon['body__child']} ${stylesCommon['grow']}`}>
                <ButtonAction onClick={onActionButton} text='Continue' disabled={availableGateways.length < 1} />
            </div>
        </main>
    )
}

export default BodyChooseGateway