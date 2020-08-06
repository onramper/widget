import React from 'react'
import stylesCommon from '../../styles.module.css'

import InfoBox from '../../common/InfoBox'

interface BodyIframeViewType {
    src: string
    textInfo?: string
}

const BodyIframeView: React.FC<BodyIframeViewType> = (props) => {
    const { textInfo } = props

    return (
        <main className={stylesCommon.body}>
            <InfoBox in={textInfo !== undefined} className={`${stylesCommon['body__child']}`}>
                {textInfo}
            </InfoBox>
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                <iframe
                    title='External content'
                    src={props.src}
                    style={{
                        width: '100%',
                        height: '100%',
                        borderStyle: 'none'
                    }}
                />
            </div>
        </main>
    )
}

export default BodyIframeView