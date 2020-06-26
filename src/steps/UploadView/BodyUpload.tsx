import React from 'react'
import stylesCommon from '../../styles.module.css'
import styles from './styles.module.css'

import InfoBox from '../../common/InfoBox'

import IconUpload from '../../icons/uploadicon.svg'

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
                <div className={styles['upload-box']}>
                    <input type='file' />
                    <img alt='Upload icon' className={styles['upload-info']} src={IconUpload} />
                    <span className={styles['upload-info']} >
                        <strong>Drag and Drop</strong>
                        <br />
                                your address proof<br />
                                or click here<br />
                                [ Jpeg or Png ]
                    </span>

                </div>
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