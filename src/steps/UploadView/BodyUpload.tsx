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
    const [existingFiles, setExistingFiles] = useState<File[]>([])

    const [errorControlMsg, setErrorControlMsg] = useState<string>()

    useEffect(() => {
        setErrorControlMsg(errorMsg)
    }, [errorMsg])

    const handleFilesAdd = (name: string, files: File[], maxFiles: number) => {
        const existingFilesNames = existingFiles.map(f => f.name)
        files = files.filter(f => !existingFilesNames.includes(f.name))
        if (existingFilesNames.length + files.length > maxFiles) return false
        setExistingFiles(prev => ([...prev, ...files]))
        return true;
    }

    const handleFilesDelete = (name: string, fileName: string) => {
        setExistingFiles(prev => prev.filter((f) => f.name !== fileName))
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
                <UploadBox id='files' onFilesAdded={handleFilesAdd} onFileDeleted={handleFilesDelete} filesList={existingFiles} maxFiles={1} onError={(err) => console.log(err)} />
            </div>
            <div className={`${stylesCommon['body__child']}`}>
                <ButtonAction onClick={() => onActionButton(existingFiles[0])} text={isLoading ? 'Verifying...' : 'Continue'} disabled={existingFiles.length !== 1 || isLoading} />
            </div>
        </main>
    )
}

BodyUpload.defaultProps = {
    onActionButton: () => null
}

export default BodyUpload