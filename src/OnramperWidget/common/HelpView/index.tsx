import React, { useContext, useEffect, useState } from 'react';
import styles from './styles.module.css'
import commonStyles from '../../styles.module.css'

import { NavContext } from '../../NavContext'
import { CSSTransition } from 'react-transition-group';
import ButtonAction from '../ButtonAction'

interface HelpViewProps {
  buttonText?: string
  maxHeight?: string
  fixedHeight?: boolean
}

const HelpView: React.FC<HelpViewProps> = (props) => {

  const { backScreen } = useContext(NavContext);

  const [isActive, setIsActive] = useState(false)

  const { maxHeight = '350px', fixedHeight = false } = props
  const classPrefix = fixedHeight ? '--fixed' : ''

  const ANIMATION_TIMEOUT = 250

  useEffect(() => {
    setIsActive(true)
  }, [])



  const handleDismiss = () => {
    setIsActive(oldValue => !oldValue)
    setTimeout(backScreen, ANIMATION_TIMEOUT)
  }

  const style = {
    "--pane-max-height": maxHeight,
  } as React.CSSProperties;

  return (

    <div className={`${commonStyles.view} ${styles['help-view']}`} onClick={handleDismiss}>
      <CSSTransition in={isActive}
        timeout={ANIMATION_TIMEOUT}
        classNames={{
          enter: styles['collapse-enter' + classPrefix],
          enterActive: styles['collapse-enter-active' + classPrefix],
          exit: styles['collapse-exit' + classPrefix],
          exitActive: styles['collapse-exit-active' + classPrefix],
        }}
        mountOnEnter={true}
        unmountOnExit={true}>
        <div style={style} onClick={(e) => e.stopPropagation()} className={`${commonStyles.body} ${styles['help-pane']} ${styles['help-pane' + classPrefix]}`} >
          {props.children}
          {props.buttonText && <ButtonAction onClick={handleDismiss} text={props.buttonText} />}
        </div>
      </CSSTransition>


    </div>
  );
};

export default HelpView;