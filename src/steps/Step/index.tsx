import React from 'react';
import StepViewContent from './StepViewContent'
import styles from '../../styles.module.css'

import { NextStep } from '../../common/types'

const StepView: React.FC<NextStep> = (props) => {

  return (
    <div className={styles.view}>
      <StepViewContent {...props} />
    </div>
  );
};

export default StepView;