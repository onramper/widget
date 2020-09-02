import React from 'react';
import StepViewContent from './StepViewContent'
import styles from '../../styles.module.css'
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import { NextStep } from '../../ApiContext'

const StepView: React.FC<{ nextStep: NextStep, needsConfirm?: boolean }> = (props) => {

  return (
    <div className={styles.view}>
      <Header title="" backButton />
      <StepViewContent {...props} />
      <Footer />
    </div>
  );
};

export default StepView;