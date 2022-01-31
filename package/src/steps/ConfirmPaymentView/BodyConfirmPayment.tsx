import React, { useEffect, useState } from 'react'
import stylesCommon from '../../styles.module.css'
import styles from './styles.module.css'

import IconChevron from '../../icons/chevron-right.svg'
import { ReactComponent as IconPay } from '../../icons/payment.svg'
import { ReactComponent as IconWallet } from '../../icons/wallet.svg'
import { ReactComponent as IconTag } from '../../icons/tag.svg'
import { ReactComponent as IconExpectedtime } from '../../icons/expected_time.svg'

import { CSSTransition } from 'react-transition-group';

import ButtonAction from '../../common/ButtonAction'
import Footer from '../../common/Footer'
import Heading from '../../common/Heading/Heading'
import InfoBox from '../../common/InfoBox'
import StepsOverview from '../../common/StepsOverview/StepsOverview'

type BodyConfirmPaymentViewType = {
    onActionButton: () => void
    payAmount: number
    fees?: number
    currency?: string
    cryptoAmount: number
    cryptoDenom: string
    cryptoAddr?: string
    cryptoAddrTag?: string
    paymentMethod?: string
    fiatIcon?: string
    cryptoIcon?: string
    txTime?: { seconds: number, message: string }
    conversionRate?: number
    heading?: string;
    subHeading?: string;
    errorMessage?: string;
    isLoading?: boolean;
}

const BodyConfirmPaymentView: React.FC<BodyConfirmPaymentViewType> = (props) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const transitionRef = React.useRef(null);
    
    const [errorControlMsg, setErrorControlMsg] = useState<string>();
    useEffect(() => {
        setErrorControlMsg(props.errorMessage);
    }, [props.errorMessage]);

    const generateOverview = () => [
      {
        description: "You pay",
        title: "200 EUR",
        icon: props.fiatIcon,
        className: styles["fiat-step"],
        items: [
          {
            content: (
              <>
                Conversion Rate{" "}
                <span className={stylesCommon["semibold"]}>
                  {" "}
                  1 BTC = 39.799.41{" "}
                </span>
              </>
            ),
          },
          {
            content: (
              <>
                Transfer Fee{" "}
                <span className={stylesCommon["semibold"]}> 9.34 EUR </span>
              </>
            ),
          },

          {
            content: (
              <>
                Transfer Fee{" "}
                <span className={stylesCommon["semibold"]}> 9.34 EUR </span>
              </>
            ),
          },
        ],
      },
      {
        description: "You receive",
        title: "0.00472 BTC",
        icon: props.cryptoIcon,
        info: "This might differ due to vollatility of the marketof the marketof the marketof the marketof the marketof the marketof the market",
        items: [
            {
                content: (
                  <>
                    Conversion Rate{" "}
                    <span className={stylesCommon["semibold"]}>
                      {" "}
                      1 BTC = 39.799.41{" "}
                    </span>
                  </>
                ),
              },
              {
                content: (
                  <>
                    Transfer Fee{" "}
                    <span className={stylesCommon["semibold"]}> 9.34 EUR </span>
                  </>
                ),
              },
    
              {
                content: (
                  <>
                    Transfer Fee{" "}
                    <span className={stylesCommon["semibold"]}> 9.34 EUR </span>
                  </>
                ),
              },
        ]
      },
      {
        description: "You receive",
        title: "0.00472 BTC",
        icon: props.cryptoIcon,
        items: [
            {
                content: (
                  <>
                    Conversion Rate{" "}
                    <span className={stylesCommon["semibold"]}>
                      {" "}
                      1 BTC = 39.799.41{" "}
                    </span>
                  </>
                ),
              },
              {
                content: (
                  <>
                    Transfer Fee{" "}
                    <span className={stylesCommon["semibold"]}> 9.34 EUR </span>
                  </>
                ),
              },
    
              {
                content: (
                  <>
                    Transfer Fee{" "}
                    <span className={stylesCommon["semibold"]}> 9.34 EUR </span>
                  </>
                ),
              },
        ]
      },
    ];

    return (
        <main className={stylesCommon.body}>
            <InfoBox type='error' in={!!errorControlMsg} className={`${stylesCommon.body__child}`} canBeDismissed onDismissClick={() => setErrorControlMsg(undefined)}>
                {errorControlMsg}
            </InfoBox>

            <div className={`${stylesCommon.body__child} ${stylesCommon.grow} ${styles.container}`}>
                {(props.heading || props.subHeading) && <Heading text={props.heading} textSubHeading={props.subHeading} /> }

                <ul className={`${styles.wrapper}`}>
                    <Item type='main' icon={<IconPay className={styles.icon} />} title='Pay' content={`${props.payAmount} ${props.currency}`} onClick={props.conversionRate || props.fees ? () => setIsExpanded(actual => !actual) : undefined} isExpanded={isExpanded} />
                    <CSSTransition
                        nodeRef={transitionRef}
                        in={isExpanded}
                        timeout={1000}
                        classNames={{
                            enter: styles['details-enter'],
                            enterActive: styles['details-enter-active'],
                            exit: styles['details-exit'],
                            exitActive: styles['details-exit-active']
                        }}
                        unmountOnExit
                        onEnter={() => setIsExpanded(true)}
                        onExited={() => setIsExpanded(false)}
                    >
                        <div ref={transitionRef} className={styles['details-container']}>
                            {props.conversionRate !== undefined && <Item type='detail' title='Conversion rate' content={`1 ${props.cryptoDenom} = ${props.conversionRate} ${props.currency}`} />}
                            {props.fees !== undefined && <Item type='detail' title='Transaction fee' content={`${props.fees} ${props.currency}`} />}
                        </div>
                    </CSSTransition>
                    <Item type='main' icon={props.cryptoIcon} title='In exchange of' content={`${props.cryptoAmount} ${props.cryptoDenom}`} />
                </ul>
                {
                    props.cryptoAddr &&
                    <ul className={`${styles.wrapper}`}>
                        <Item type='main' icon={<IconWallet className={styles.icon} />} title={`${props.cryptoDenom} wallet address`} content={props.cryptoAddr} single />
                    </ul>
                }
                {
                    props.cryptoAddrTag &&
                    <ul className={`${styles.wrapper}`}>
                        <Item type='main' icon={<IconTag className={styles.icon} />} title={`Address tag`} content={props.cryptoAddrTag} single />
                    </ul>
                }
                {/*                 <ul className={`${styles['wrapper']}`}>
                    <Item type='main' icon={<IconPaymentMethod className={styles['icon']} />} title='Payment method' content={props.paymentMethod} />
                </ul> */}
                <ul className={`${styles.wrapper}`}>
                    {props.txTime && <Item type='main' icon={<IconExpectedtime className={styles.icon} />} title='Expected transaction time' content={props.txTime.message} single />}
                </ul>
                {/* <label className={styles['terms']}><input type="checkbox" name='agreementCheckbox' onChange={(e) => inputInterface.handleInputChange(e.currentTarget.name, e.currentTarget.checked)} /> I accept the gateway's privacy policy, transaction policy and terms of use and Onramper's privacy policy and terms of use.</label> */}
            </div>
            
            <StepsOverview
                className={stylesCommon.body__child}
                items={generateOverview()}
            />

            <div className={`${stylesCommon.body__child}`}>
                <ButtonAction
                    onClick={props.onActionButton}
                    text={props.isLoading ? "Loading..." : "Continue"}
                    disabled={!!props.isLoading}
                />
                <Footer />  
            </div>
        </main >
    )
}

type ItemType = {
    type: 'main' | 'detail'
    single?: boolean,
    onClick?: () => void,
    title: string,
    content: string
    icon?: React.ReactNode | string
    isExpanded?: boolean
}

const Item: React.FC<ItemType> = (props) => {
    const { isExpanded = false, single = false, onClick = () => null, icon = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' } = props
    const typeClass = props.type === 'main' ? 'item--main' : 'item--detail'

    return (
        <li className={`${styles.item} ${styles[typeClass]} ${single ? styles['item--single'] : ''}`}>
            {props.type === 'main' ?
                /* <img className={`${styles['icon']}`} src={icon} alt='Icon item' /> */
                /* <svg className={`${styles['icon']}`}>
                    <use xlinkHref={`${icon}#icon`} />
                </svg> */
                typeof icon === 'string' ? <img className={`${styles.icon}`} src={icon} alt='Icon item' /> : icon
                :
                <i className={styles.dot} />
            }
            <div className={`${styles.content} ${props.onClick ? styles['content--expandable'] : ''}`} onClick={onClick}>
                <span className={styles.title} >{props.title}</span>
                <span className={styles.description} >{props.content}</span>
            </div>
            {props.onClick && <img src={IconChevron} className={`${styles.chevron} ${isExpanded ? styles['chevron--down'] : styles['chevron--up']}`} alt='Expand button' onClick={onClick} />}
        </li>
    )
}

BodyConfirmPaymentView.defaultProps = {

}

export default BodyConfirmPaymentView
