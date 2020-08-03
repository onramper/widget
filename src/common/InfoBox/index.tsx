import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import { CSSTransition } from 'react-transition-group';

type InfoBoxType = {
    text?: string
    type?: 'info' | 'error'
    onClose?: () => void
    canBeClosed?: boolean
}

const InfoBox: React.FC<InfoBoxType> = (props) => {
    const { text, type = 'info', onClose = () => null, canBeClosed = false } = props

    const [isOpen, setIsOpen] = useState(props.text ? true : false)

    useEffect(() => {
        setIsOpen(props.text ? true : false)
    }, [props.text])

    let classBoxType = ''
    switch (type) {
        case 'error':
            classBoxType = 'infobox--error'
            break;
        case 'info':
        default:
            classBoxType = 'infobox--info'
            break;
    }

    const handleClose = () => {
        setIsOpen(false)
        onClose()
    }

    return (
        <CSSTransition in={isOpen}
            timeout={{
                enter: 100,
                exit: 0
            }}
            classNames={{
                enter: styles['collapse-enter'],
                enterActive: styles['collapse-enter-active'],

            }}
            unmountOnExit={true} >
            <div className={`${styles.infobox} ${styles[classBoxType]}`}>
                <span className={styles['text']}>{text}</span>
                {canBeClosed && <span className={styles['close-button']} onClick={handleClose} >✖</span>}
            </div>
        </CSSTransition >
    )
}


export default InfoBox
