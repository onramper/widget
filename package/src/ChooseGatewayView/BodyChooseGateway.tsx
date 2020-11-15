import React from 'react'
import stylesCommon from '../styles.module.css'

import ButtonAction from '../common/ButtonAction'

import { GatewayRateOption } from '../ApiContext'
import InfoBox from '../common/InfoBox'
import ErrorVisual from '../common/ErrorVisual'
import RatesList from './RatesList'

type BodyChooseGatewayType = {
    onActionButton?: () => void,
    onItemClick?: (index: number) => void,
    ratesList: GatewayRateOption[]
}

const BodyChooseGateway: React.FC<BodyChooseGatewayType> = (props) => {
    const { onActionButton, onItemClick } = props
    const { ratesList } = props

    const availableRates = ratesList.filter(el => el.available)
    const unavailableRates = ratesList.filter(el => !el.available)

    return (
        <main className={stylesCommon.body}>
            {ratesList.length > 0 ?
                <div className={`${stylesCommon.body__child}`}>
                    <RatesList availableRates={availableRates} unavailableRates={unavailableRates} onItemClick={onItemClick} />
                </div>
                : (
                    <>
                        <InfoBox in={true} type='info' className={`${stylesCommon.body__child}`}>
                            No prices available at this time.
                        </InfoBox>
                        <div className={`${stylesCommon.body__child} ${stylesCommon.grow}`}>
                            <ErrorVisual message="An error occurred while trying to connect to server. Please try again later." />
                        </div>
                    </>
                )
            }
            <div className={`${stylesCommon.body__child} ${stylesCommon.grow}`}>
                <ButtonAction onClick={onActionButton} text='Continue' disabled={availableRates.length < 1} />
            </div>
        </main>
    )
}

export default BodyChooseGateway
