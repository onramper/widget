import React, { useEffect } from 'react'
import stylesCommon from '../../styles.module.css'

import InfoBox from '../../common/InfoBox'

interface BodyIframeViewType {
    src: string
    type: string
    textInfo?: string
}

const BodyIframeView: React.FC<BodyIframeViewType> = (props) => {
    const { textInfo, type } = props

    useEffect(() => {
        if (type === 'redirect')
            window.open(props.src, '_blank', 'location=yes,height=595,width=440,scrollbars=yes,status=yes')
    }, [props.src, type])

    return (
        <main className={stylesCommon.body}>
            <InfoBox in={textInfo !== undefined} className={`${stylesCommon['body__child']}`}>
                {textInfo}
            </InfoBox>
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                {
                    (type === 'redirect') ? <span>Loading...</span>
                        : <iframe
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