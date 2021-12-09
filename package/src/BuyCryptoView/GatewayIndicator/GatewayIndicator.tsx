import React, { useEffect, useState } from 'react';
import { GatewayIndicatorProps } from './GatewayIndicator.models';
import arrowDownIcon from "./../../icons/arrow-down.svg";
import styles from "./GatewayIndicator.module.css";
import commonStyles from "./../../styles.module.css";
import Loader from '../../common/Loader/Loader';

const Skeleton: React.FC = () => {
    return (<div className={`${styles.wrapper} ${commonStyles["skeleton-wrapper"]}`}>
        <div className={`${styles["option-wrapper"]}`}>
            <span className={`${commonStyles["skeleton-box"]} ${styles["sk-image"]}`}></span>
            <div className={`${styles["option-body"]} ${styles["sk-option-body"]}`} >
                <span className={`${styles["option-label"]}`}>Best rate via</span>
                <span className={`${styles["option-handle"]} ${commonStyles["skeleton-box"]}`}>Lorem</span>
            </div>
        </div>
        <div className={`${styles["option-info"]} ${commonStyles["skeleton-box"]}`}>
            Lorem ipsum dolor sit amet <br/> Lorem ipsum dolor sit amet
        </div>
    </div>);
}

const determineRate = (amountInCrypto:boolean, oneDirectionRate: number|undefined) => {
    if(!oneDirectionRate) return 0;
    
    const format = (n:number) => n.toLocaleString(undefined, {maximumFractionDigits: 5});

    if(!amountInCrypto) {
        return format(oneDirectionRate);
    }

    return format(1 / oneDirectionRate)
}

const GatewayIndicator: React.FC<GatewayIndicatorProps> = (props: GatewayIndicatorProps) => {
    const [rate, setRate] = useState(determineRate(props.amountInCrypto, props.selectedGateway?.rate));

    useEffect(() => {
        setRate(determineRate(props.amountInCrypto, props.selectedGateway?.rate));
    }, [props.amountInCrypto, props.selectedGateway?.rate]);

    if (props.isInitialLoading || !props.selectedGateway) return <Skeleton />;
    
    if(props.isLoading) {
        return (
            <div className={styles.wrapper}>
                <Loader />
            </div>
        );
    }

    return (<div className={styles.wrapper}>
        <div className={styles["option-wrapper"]}>
            <img className={styles["option-icon"]} src={props.selectedGateway.icon} alt="selected-icon" />
            <div className={styles["option-body"]} >
                <div className={`${styles["option-label"]}`}>Best rate via</div>
                <div className={styles["option-handle"]} onClick={props.openMoreOptions}>
                    <span>{props.selectedGateway.name}</span> <img src={arrowDownIcon} />
                </div>
            </div>
        </div>
        <div className={styles["option-info"]}>
            1 {props.unitCrypto} ≈ {rate} {props.unitFiat}
            <br />Includes all feees
        </div>
    </div>);
}
export default GatewayIndicator;