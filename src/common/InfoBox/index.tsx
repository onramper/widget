import React from 'react'
import styles from './styles.module.css'
import { CSSTransition } from 'react-transition-group';

type InfoBoxType = {
    type?: 'info' | 'error'
    onDismissClick?: () => void
    canBeDismissed?: boolean
    in: boolean
}

const InfoBox: React.FC<InfoBoxType> = (props) => {
    const { type = 'info', onDismissClick = () => null, canBeDismissed = false } = props

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

    return (
        <CSSTransition in={props.in}
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
                <span className={styles['text']}>
                    {props.children}
                </span>
                {canBeDismissed && <span className={styles['close-button']} onClick={onDismissClick} >✖</span>}
            </div>
        </CSSTransition >
    )
}


export default InfoBox
