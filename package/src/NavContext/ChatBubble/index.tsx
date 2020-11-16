import React from 'react'
import styles from './styles.module.css'
import { CSSTransition } from 'react-transition-group';

interface ChatBubbleType {
    intro?: boolean
}

export const ChatBubble: React.FC<ChatBubbleType> = (props) => {
    const iframeRef = React.useRef<HTMLIFrameElement>(null)
    /* const transitionRef = React.useRef<HTMLIFrameElement>(null) */
    const [isChatOpen, setIsChatOpen] = React.useState(false)
    const [isDone, setIsDone] = React.useState(0)
    const [status, setStatus] = React.useState(false)
    const { intro = false } = props
    const chatURL = "https://tawk.to/chat/5faec5a2c52f660e8973425f/default"

    React.useEffect(() => {
        if (intro)
            setIsDone(1)
        else if (isDone === 1)
            setIsDone(2)
    }, [intro, isDone])

    React.useEffect(() => {
        const chackUp = async () => {
            fetch(chatURL).then((response) => {
                console.log(response)
                setStatus(response.status === 200)
            }).catch(console.log)
        }
        chackUp()
    })

    return (
        status ? <div>
            <CSSTransition
                onEnter={() => {
                    if (iframeRef.current)
                        iframeRef.current.style.display = 'block'
                }}
                onExited={() => {
                    if (iframeRef.current)
                        iframeRef.current.style.display = 'none'
                }}
                in={isChatOpen}
                timeout={200}
                classNames={{
                    enter: styles['screen-enter'],
                    enterActive: styles['screen-enter-active'],
                    exit: styles['screen-exit'],
                    exitActive: styles['screen-exit-active']
                }}>
                <iframe
                    ref={iframeRef}
                    frameBorder="0"
                    title="Helper chat"
                    src="https://tawk.to/chat/5faec5a2c52f660e8973425f/default"
                    className={styles.floating}
                />
            </CSSTransition>
            <div className={`${styles["chat"]} ${!intro ? (isDone === 0 ? '' : styles['shy']) : styles['hi']} ${isChatOpen ? styles["active"] : ''}`} onClick={(e) => {
                e.preventDefault()
                setIsChatOpen(prevState => !prevState)
            }}>
                <div className={`${styles['anim-container']}`}>
                    <div className={styles["background"]}><span onClick={(e) => e.preventDefault()} className={styles["background-text"]}>Do you need help?</span></div>
                    <svg className={styles["chat-bubble"]} width="46.875" height="46.875" viewBox="12 13.5 75 75">
                        <g className={styles["bubble"]}>
                            <path className={`${styles["line"]} ${styles["line1"]}`} d="M 30.7873,85.113394 30.7873,46.556405 C 30.7873,41.101961
          36.826342,35.342 40.898074,35.342 H 59.113981 C 63.73287,35.342
          69.29995,40.103201 69.29995,46.784744" />
                            <path className={`${styles["line"]} ${styles["line2"]}`} d="M 13.461999,65.039335 H 58.028684 C
            63.483128,65.039335
            69.243089,59.000293 69.243089,54.928561 V 45.605853 C
            69.243089,40.986964 65.02087,35.419884 58.339327,35.419884" />
                        </g>
                        <circle className={`${styles["circle"]} ${styles["circle1"]}`} r="1.9" cy="50.7" cx="42.5" />
                        <circle className={`${styles["circle"]} ${styles["circle2"]}`} cx="49.9" cy="50.7" r="1.9" />
                        <circle className={`${styles["circle"]} ${styles["circle"]}`} r="1.9" cy="50.7" cx="57.3" />
                    </svg>
                </div>
            </div>
        </div>
            : <></>
    )
}

export default ChatBubble