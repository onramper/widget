import React, { useState, useCallback } from 'react'
import styles from './styles.module.css'

import IconUpload from '../../icons/uploadicon.svg'
import IconDocument from '../../icons/document.svg'
import IconDelete from '../../icons/deleteicon.svg'

type UploadBoxType = {

}

const UploadBox: React.FC<UploadBoxType> = (props) => {

    const [isDragOver, setIsDragOver] = useState(false)
    const handleDragEnter = useCallback(() => setIsDragOver(true), []);
    const handleDragLeave = useCallback(() => setIsDragOver(false), []);

    const [files, setfiles] = useState<File[]>([])
    const handleOnDropFiles = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        let newFiles = [...e.dataTransfer.files]
        if (newFiles && newFiles.length > 0) {
            const existingFiles = files.map(f => f.name)
            newFiles = newFiles.filter(f => !existingFiles.includes(f.name))
            setfiles([...files, ...newFiles])
            e.dataTransfer.clearData();
        }
    }, [files]);

    const handleOnSelectFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let newFiles = [...e.currentTarget.files!]
        if (newFiles && newFiles.length > 0) {
            const existingFiles = files.map(f => f.name)
            newFiles = newFiles.filter(f => !existingFiles.includes(f.name))
            setfiles([...files, ...newFiles])
            e.currentTarget.value = '';
        }
    }, [files]);

    const handleDeleteClick = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
        const name2delete = e.currentTarget.getAttribute('data-name')
        const newList = files.filter(f => f.name != name2delete)
        setfiles(newList)
    }, [files]);

    return (
        <div className={styles['upload-container']} >
            {files.length > 0 ?
                files.map(f => <FileItem key={f.name} fileName={f.name} onDeleteClick={handleDeleteClick} />)
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

const FileItem: React.FC<{ fileName: string, key: string, onDeleteClick: (e: React.MouseEvent<HTMLImageElement>) => void }> = (props) => {
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