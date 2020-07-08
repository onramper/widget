import React, { useContext } from 'react'
import stylesCommon from '../../styles.module.css'

import InfoBox from '../../common/InfoBox'
import UploadBox from './UploadBox'

import { APIContext } from '../../wrappers/APIContext'


type BodyUploadType = {
    onButtonAction?: () => void,
    textInfo?: string
}

const BodyUpload: React.FC<BodyUploadType> = (props) => {
    const { textInfo } = props
    const { onButtonAction } = props

    const { inputInterface, collected } = useContext(APIContext)

    return (
        <main className={stylesCommon.body}>
            {textInfo ?
                <div className={`${stylesCommon['body__child']}`}>
                    <InfoBox text={textInfo!} />
                </div> : null}
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                <UploadBox id='files-id' onFilesAdded={inputInterface.handleFilesAdded} onFileDeleted={inputInterface.handleFileDeleted} filesList={collected['files-id']} maxFiles={2} onError={(err) => console.log(err)} />
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