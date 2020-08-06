import React, { useContext } from 'react'
import stylesCommon from '../../styles.module.css'

import InfoBox from '../../common/InfoBox'
import ButtonAction from '../../common/ButtonAction'
import UploadBox from './UploadBox'

import { APIContext } from '../../context'


type BodyUploadType = {
    onActionButton?: () => void,
    textInfo?: string
}

const BodyUpload: React.FC<BodyUploadType> = (props) => {
    const { textInfo } = props
    const { onActionButton } = props

    const { inputInterface, collected } = useContext(APIContext)

    return (
        <main className={stylesCommon.body}>
            <InfoBox in={textInfo !== undefined} className={`${stylesCommon['body__child']}`}>
                {textInfo}
            </InfoBox>
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                <UploadBox id='files' onFilesAdded={inputInterface.handleFilesAdded} onFileDeleted={inputInterface.handleFileDeleted} filesList={collected['files']} maxFiles={2} onError={(err) => console.log(err)} />
            </div>
            <div className={`${stylesCommon['body__child']}`}>
                <ButtonAction onClick={onActionButton} text='Continue' />
            </div>
        </main>
    )
}

BodyUpload.defaultProps = {
    onActionButton: () => null
}

export default BodyUpload