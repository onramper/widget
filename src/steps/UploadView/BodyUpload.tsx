import React from 'react'
import stylesCommon from '../../styles.module.css'

import InfoBox from '../../common/InfoBox'
import UploadBox from './UploadBox'


type BodyUploadType = {
    onButtonAction?: () => void,
    textInfo?: string
}

const BodyUpload: React.FC<BodyUploadType> = (props) => {
    const { textInfo } = props
    const { onButtonAction } = props

    return (
        <main className={stylesCommon.body}>
            {textInfo ?
                <div className={`${stylesCommon['body__child']}`}>
                    <InfoBox text={textInfo!} />
                </div> : null}
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                <UploadBox />
            </div>
            <div className={`${stylesCommon['body__child']}`}>
                <button onClick={onButtonAction} className={`${stylesCommon['button-action']}`}>Continue</button>
            </div>
        </main>
    )
}

BodyUpload.defaultProps = {
    onButtonAction: () => null
}

export default BodyUpload