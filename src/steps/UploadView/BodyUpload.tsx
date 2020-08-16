import React, { useState, useEffect } from 'react'
import stylesCommon from '../../styles.module.css'

import InfoBox from '../../common/InfoBox'
import ButtonAction from '../../common/ButtonAction'
import UploadBox from './UploadBox'


type BodyUploadType = {
    onActionButton: (file: File) => void,
    textInfo?: string
    isLoading?: boolean
    errorMsg?: string
}

const BodyUpload: React.FC<BodyUploadType> = (props) => {
    const { textInfo, isLoading = false, errorMsg } = props
    const { onActionButton } = props
    const [filesState, setFiles] = useState<File[]>([])

    const [errorControlMsg, setErrorControlMsg] = useState<string>()

    useEffect(() => {
        setErrorControlMsg(errorMsg)
    }, [errorMsg])

    const handleFilesAdd = (name: string, files: File[], maxFiles: number) => {
        if (maxFiles < (files.length + filesState.length)) return false
        setFiles(prev => ([...prev, ...files]))
        return true
    }

    const handleFilesDelete = (name: string, fileName: string) => {
        setFiles(prev => prev.filter((f) => f.name !== fileName))
        return true
    }

    return (
        <main className={stylesCommon.body}>
            <InfoBox in={textInfo !== undefined} className={`${stylesCommon['body__child']}`}>
                {textInfo}
            </InfoBox>
            <InfoBox type='error' in={errorControlMsg !== undefined} className={`${stylesCommon['body__child']}`} canBeDismissed onDismissClick={() => setErrorControlMsg(undefined)}>
                {errorControlMsg}
            </InfoBox>
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                <UploadBox id='files' onFilesAdded={handleFilesAdd} onFileDeleted={handleFilesDelete} filesList={filesState} maxFiles={1} onError={(err) => console.log(err)} />
            </div>
            <div className={`${stylesCommon['body__child']}`}>
                <ButtonAction onClick={() => onActionButton(filesState[0])} text={isLoading ? 'Verifying...' : 'Continue'} disabled={filesState.length !== 1 || isLoading} />
            </div>
        </main>
    )
}

BodyUpload.defaultProps = {
    onActionButton: () => null
}

export default BodyUpload