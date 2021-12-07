import React, { useState } from 'react'
import stylesCommon from '../../styles.module.css'
import styles from './styles.module.css'

import ButtonAction from '../../common/ButtonAction'
import InfoBox from '../../common/InfoBox'

import { FileStep } from '../../ApiContext'
import { useTranslation } from 'react-i18next'

type BodyPickOptionType = {
    onActionButton: () => void
    handleOptionChange: (i: number) => void
    steps?: FileStep[]
    isFilled?: boolean
    isLoading?: boolean
    infoMsg?: string
    inputName?: string
}

const BodyPickOption: React.FC<BodyPickOptionType> = (props) => {
    const { t } = useTranslation();

    const { onActionButton, steps = [] } = props
    const { isFilled = false, isLoading = false, infoMsg } = props

    return (
        <main className={stylesCommon.body}>
            <InfoBox in={!!infoMsg} type='info' className={`${stylesCommon.body__child}`} >
                {infoMsg}
            </InfoBox>
            <div className={`${stylesCommon.body__child}`}>
                <InputRadio options={steps.map((item) => ({ name: item.humanName, value: item.humanName }))} onItemClick={props.handleOptionChange} />
            </div>
            <div className={`${stylesCommon.body__child} ${stylesCommon.grow}`}>
                <ButtonAction onClick={onActionButton} text={isLoading ? t('kycScreens.sendingProgressMessage') : t('kycScreens.continueButtonText')} disabled={!isFilled} />
            </div>
        </main >
    )
}

interface InputRadioType {
    options: {
        value?: string,
        name?: string
    }[]
    onItemClick?: (i: number) => void
}

const InputRadio: React.FC<InputRadioType> = ({ options, onItemClick = () => null }) => {
    const { t } = useTranslation();

    const [itemClicked, setIndexClicked] = useState(0)
    const onClick = (i: number) => {
        setIndexClicked(i)
        onItemClick(i)
    }

    return (
        <>
            {
                options.map((item, i) =>
                    <div className={styles.option} key={i}>
                        <label><input className={styles['input--radio']} type="radio" value={item.value ?? `${t('kycScreens.itemPrefix')} ${i}`} checked={i === itemClicked} onChange={() => onClick(i)} />{item.name ?? `${t('kycScreens.itemPrefix')} ${i}`}</label>
                    </div>
                )
            }
        </>
    )
}

BodyPickOption.defaultProps = {

}

export default BodyPickOption
