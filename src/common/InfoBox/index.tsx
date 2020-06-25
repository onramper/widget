import React from 'react'
import styles from './styles.module.css'

type InfoBoxType = {
    text: string
}

const InfoBox: React.FC<InfoBoxType> = (props) => {
    const { text } = props
    return (
        <p className={styles.infobox}>{text}</p>
    )
}

InfoBox.defaultProps = {
}

export default InfoBox
