import React, { useContext, useEffect, useState } from 'react';
import styles from './styles.module.css'
import commonStyles from '../../styles.module.css'

import { NavContext } from '../../NavContext'
import { CSSTransition } from 'react-transition-group';
import ButtonAction from '../ButtonAction'

interface HelpViewProps {

}

const HelpView: React.FC<HelpViewProps> = (props) => {

  const { backScreen } = useContext(NavContext);

  const [isActive, setIsActive] = useState(false)

  const ANIMATION_TIMEOUT = 250

  useEffect(() => {
    setIsActive(true)
  }, [])



  const handleDismiss = () => {
    setIsActive(oldValue => !oldValue)
    setTimeout(backScreen, ANIMATION_TIMEOUT)
  }

  return (

    <div className={`${commonStyles.view} ${styles['help-view']}`} onClick={handleDismiss}>
      <CSSTransition in={isActive}
        timeout={ANIMATION_TIMEOUT}
        classNames={{
          enter: styles['collapse-enter'],
          enterActive: styles['collapse-enter-active'],
          exit: styles['collapse-exit'],
          exitActive: styles['collapse-exit-active'],
        }}
        mountOnEnter={true}
        unmountOnExit={true}>
        <div onClick={(e) => e.stopPropagation()} className={`${commonStyles.body} ${styles['help-pane']}`} >
          {props.children}
          <ButtonAction onClick={handleDismiss} text="Got it👌" />
        </div>
      </CSSTransition>


    </div>
  );
};

export default HelpView;