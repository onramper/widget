import React, { useEffect, useState, useCallback } from 'react'
import stylesCommon from '../../styles.module.css'

import InfoBox from '../../common/InfoBox'

interface BodyIframeViewType {
    src: string
    type: string
    textInfo?: string
    error?: string
    onErrorDismissClick: () => void
}

const BodyIframeView: React.FC<BodyIframeViewType> = (props) => {
    const { textInfo, type, error } = props
    const [autoRedirect, setAutoRedirect] = useState(type === 'redirect')

    const redirect = useCallback(() => {
        //try to open popup
        let windowObjectReference = window.open(props.src, '_blank', 'location=yes,height=595,width=440,scrollbars=yes,status=yes')//add configF
        //if opened -> all is ok
        if (windowObjectReference) return true
        //if not opened -> warn user about popup blocked + ask user for click a button
        console.log('not opened:(')
        return false
    }, [props.src])

    useEffect(() => {
        if (type === 'redirect')
            if (!redirect())
                setAutoRedirect(false)


    }, [props.src, type, redirect])

    return (
        <main className={stylesCommon.body}>
            <InfoBox in={!!textInfo} className={`${stylesCommon['body__child']}`}>
                {textInfo}
            </InfoBox>
            <InfoBox in={!!error} className={`${stylesCommon['body__child']}`} type='error' canBeDismissed onDismissClick={props.onErrorDismissClick} >
                {error}
            </InfoBox>
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                {
                    ((autoRedirect) && <span>Loading...</span>)
                    || ((!autoRedirect) && <button onClick={redirect} >Redirect</button>)
                    || <iframe
                        title='Sandbox'
                        src={props.src}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderStyle: 'none'
                        }}
                    />
                }
            </div>
        </main>
    )
}

export default BodyIframeView