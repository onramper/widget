import React from 'react'
import styles from './styles.module.css'
import { toMaxDecimalsFloor } from '../../utils'

const LEVEL_COLORS_CLASS = {
    "LOW": styles['color--low'],
    "MEDIUM": styles['color--medium'],
    "HIGH": styles['color--high']
}

type RangeType = {
    min: number,
    max: number,
    actual: number
}

const Range: React.FC<RangeType> = (props) => {
    const { min, max, actual } = props
    const actualInRange = actual < min ? min : actual > max ? max : actual
    const actialPosition = (actualInRange - min) / (max - min) * 100
    const actualLevel = actialPosition > 80 ? LEVEL_COLORS_CLASS.HIGH : actialPosition > 40 ? LEVEL_COLORS_CLASS.MEDIUM : LEVEL_COLORS_CLASS.LOW
    return (
        <div>
            <div className={styles.range}>
                <div className={`${LEVEL_COLORS_CLASS.LOW} ${styles.range__section}`} ></div>
                <div className={`${LEVEL_COLORS_CLASS.LOW} ${styles.range__section}`} ></div>
                <div className={`${LEVEL_COLORS_CLASS.MEDIUM} ${styles.range__section}`} ></div>
                <div className={`${LEVEL_COLORS_CLASS.MEDIUM} ${styles.range__section}`} ></div>
                <div className={`${LEVEL_COLORS_CLASS.HIGH} ${styles.range__section}`} ></div>
            </div>
            <div className={styles['range-label-container']} >
                <span className={styles['range-label__min']} >{min}%</span>
                <div style={{ "left": `${actialPosition}%` }} className={styles['range-label__actual']} >
                    <span className={`${styles.bubble} ${actualLevel}`}>{toMaxDecimalsFloor(actual, 2)}%</span>
                </div>
                <span className={styles['range-label__max']} >{max}%</span>
            </div>
        </div>
    )
}

export default Range
