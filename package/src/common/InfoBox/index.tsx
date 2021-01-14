import React from 'react'
import styles from './styles.module.css'
import { CSSTransition } from 'react-transition-group';
import ButtonAction from '../ButtonAction'

type InfoBoxType = {
    type?: 'info' | 'error' | 'notification'
    onDismissClick?: () => void
    canBeDismissed?: boolean
    in: boolean
    className?: string
    onActionClick?: () => void
    actionText?: string
}

const InfoBox = React.forwardRef<HTMLDivElement, React.PropsWithChildren<InfoBoxType>>((props, ref) => {
    const {
        type = 'info',
        onDismissClick = () => null,
        canBeDismissed = false,
        className = '',
        actionText = 'See more'
    } = props
    const defaultRef = ref || React.createRef<HTMLDivElement>();
    let classBoxType = ''
    switch (type) {
        case 'error':
            classBoxType = 'infobox--error'
            break;
        case 'notification':
            classBoxType = 'infobox--notification'
            break;
        case 'info':
        default:
            classBoxType = 'infobox--info'
            break;
    }

    const main = window.document.getElementById('main')
    const primaryColor = main !== null ? getComputedStyle(main).getPropertyValue('--primary-color').replace('#', '') : undefined

    const style = {
        "--color-border": "var(--primary-color)",
        "--color-background": `#${primaryColor}15`,
    } as React.CSSProperties;

    return (
        <CSSTransition nodeRef={defaultRef} in={props.in}
            timeout={{
                enter: 100,
                exit: 0
            }}
            classNames={{
                enter: styles['collapse-enter'],
                enterActive: styles['collapse-enter-active']

            }}
            unmountOnExit={true} >
            <div style={style} ref={defaultRef} className={`${styles.infobox} ${styles[classBoxType]} ${className}`}>
                <span className={styles.text}>
                    {props.children}
                </span>
                {
                    props.onActionClick &&
                    <span style={{ fontSize: '0.7rem', paddingLeft: '2rem' }}>
                        <ButtonAction className={styles['button-action']} size='small' text={actionText} onClick={props.onActionClick} />
                    </span>
                }
                {canBeDismissed && <span className={styles['close-button']} onClick={onDismissClick} >✖</span>}
            </div>
        </CSSTransition >
    )
})


export default InfoBox
