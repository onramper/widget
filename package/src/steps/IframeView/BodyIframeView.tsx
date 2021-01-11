import React, { useEffect, useState, useCallback } from 'react'
import stylesCommon from '../../styles.module.css'
import styles from './styles.module.css'

import InfoBox from '../../common/InfoBox'

interface BodyIframeViewType {
    src: string
    type: string
    textInfo?: string
    error?: string
    onErrorDismissClick: () => void
    isFullScreen?: boolean
    features?: string
}

const BodyIframeView: React.FC<BodyIframeViewType> = (props) => {
    const { textInfo, type, error } = props
    const [autoRedirect, setAutoRedirect] = useState(true)
    const [iframeUrl, setIframeUrl] = useState(props.src)

    const redirect = useCallback(async (url: string) => {
        setAutoRedirect(true)
        //try to open popup
        const windowObjectReference = window.open(url, '_blank', 'height=595,width=440,scrollbars=yes')//todo: add config
        //if opened -> all is ok
        if (windowObjectReference) return
        //if not opened -> warn user about popup blocked + ask user for click a button
        setAutoRedirect(false)
    }, [])

    useEffect(() => {
        const main = window.document.getElementById('main')
        const primaryColor = main !== null ? 'color=' + getComputedStyle(main).getPropertyValue('--primary-color').replace('#', '') : undefined
        const newIframeUrl = `${props.src}${props.src.includes('?') ? '&' : '?'}${primaryColor ?? ''}`
        setIframeUrl(newIframeUrl)
        
        if (type === 'redirect')
            redirect(newIframeUrl)
    }, [props.src, redirect, type])

    return (
        <main className={`${stylesCommon.body} ${props.isFullScreen ? stylesCommon['body--full_screen'] : ''} ${styles.body}`}>
            {
                !props.isFullScreen &&
                <>
                    <InfoBox in={!!textInfo && type !== 'redirect'} className={`${stylesCommon.body__child} ${styles.body__child}`}>
                        {textInfo}
                    </InfoBox>
                    <InfoBox in={!autoRedirect} className={`${stylesCommon.body__child} ${styles.body__child}`} type='notification'>
                        {"We couldn't auto-redirect you to finish the process, please click the button below to finish the process."}
                    </InfoBox>
                    <InfoBox in={!!error} className={`${stylesCommon.body__child} ${styles.body__child}`} type='error' canBeDismissed onDismissClick={props.onErrorDismissClick} >
                        {error}
                    </InfoBox>
                </>
            }
            <div className={`${stylesCommon.body__child} ${stylesCommon.grow}`}>
                {
                    ((type === 'redirect' && autoRedirect) && (
                        <div className={`${styles.center}`}>
                            <span>Redirecting you to finish the process...</span>
                            {/* <span>A new window should be opened, if not, <span className={stylesCommon['text--link']} onClick={redirect}>click here</span>.</span> */}
                        </div>
                    ))
                    || ((type === 'redirect' && !autoRedirect) && (
                        <div className={`${styles.center}`}>
                            <span className={`${stylesCommon.body__child} `}>Please, click the button below to finish the process.</span>
                            <button className={`${stylesCommon.body__child} ${styles['button--redirect']}`} onClick={() => redirect(iframeUrl)} >Finish process</button>
                        </div>
                    ))
                    || <iframe
                        title='Sandbox'
                        src={iframeUrl}
                        allow={props.features}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderStyle: 'none'
                        }}
                    />
                }
            </div>
        </main >
    )
}

export default BodyIframeView
