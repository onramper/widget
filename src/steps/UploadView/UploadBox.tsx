import React, { useState, useCallback } from 'react'
import styles from './styles.module.css'

import IconUpload from '../../icons/uploadicon.svg'
import IconDocument from '../../icons/document.svg'
import IconDelete from '../../icons/deleteicon.svg'

type UploadBoxType = {
    onFilesAdded: (name: string, files: File[], maxFiles: number) => boolean
    onFileDeleted: (name: string, fileName: string) => void
    onError: (err: string) => void
    id: string
    filesList: File[]
    maxFiles?: number
}

const UploadBox: React.FC<UploadBoxType> = (props) => {

    const { filesList, maxFiles = -1, id } = props
    const { onFilesAdded, onError, onFileDeleted } = props

    const [isDragOver, setIsDragOver] = useState(false)
    const handleDragEnter = useCallback(() => setIsDragOver(true), []);
    const handleDragLeave = useCallback(() => setIsDragOver(false), []);

    const handleOnDropFiles = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        console.log(e.dataTransfer.files)
        let newFiles = [...e.dataTransfer.files]

        const ok = onFilesAdded(id, [...newFiles], maxFiles)
        if (!ok) onError(`You only can upload ${maxFiles} files`)

    }, [maxFiles, id, onError, onFilesAdded]);

    const handleOnSelectFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        let currentFiles = e.currentTarget.files || []
        let newFiles = [...currentFiles]

        const ok = onFilesAdded(id, [...newFiles], maxFiles)
        if (!ok) onError(`You only can upload ${maxFiles} files`)

        e.currentTarget.value = '';
    }, [maxFiles, id, onFilesAdded, onError]);

    const handleDeleteClick = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
        const name2delete = e.currentTarget.getAttribute('data-name')
        onFileDeleted(id, name2delete!)
    }, [onFileDeleted, id]);

    return (
        <div className={styles['upload-container']} >
            {filesList.map(f => <FileItem key={f.name} fileName={f.name} onDeleteClick={handleDeleteClick} />)}
            {filesList.length >= maxFiles && maxFiles > 0 ?
                null
                :
                < div onDrop={handleOnDropFiles} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} className={`${styles['drag-box']} ${isDragOver ? styles['drag-box-dragging'] : ''}`}>
                    <input type='file' multiple onChange={handleOnSelectFiles} />
                    <img alt='Upload icon' className={styles['drag-info']} src={IconUpload} />
                    <span className={styles['drag-info']} >
                        <strong>Drag and Drop</strong>
                        <br />
                                your address proof<br />
                                or click here<br />
                                [ Jpeg or Png ]
                    </span>
                </div>
            }
        </div >
    )
}

const FileItem: React.FC<{ fileName: string, onDeleteClick: (e: React.MouseEvent<HTMLImageElement>) => void }> = (props) => {
    return (
        <div className={styles.file}>
            <img alt='Icon document' src={IconDocument} />
            <span className={styles['file-name']}>{props.fileName}</span>
            <img data-name={props.fileName} alt='Delete' src={IconDelete} onClick={props.onDeleteClick} />
        </div>
    )
}

UploadBox.defaultProps = {

}

export default UploadBox