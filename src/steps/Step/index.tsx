import React from 'react';
import StepViewContent, { _nextStepType } from './StepViewContent'
import styles from '../../styles.module.css'

export type nextStepType = _nextStepType

const StepView: React.FC<nextStepType> = (props) => {

  return (
    <div className={styles.view}>
      <StepViewContent {...props} />
    </div>
  );
};

export default StepView;