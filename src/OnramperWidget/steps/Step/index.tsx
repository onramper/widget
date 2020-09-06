import React from 'react';
import StepViewContent, { NewStepProps } from './StepViewContent'
import styles from '../../styles.module.css'
import Header from '../../common/Header'
import Footer from '../../common/Footer'

const StepView: React.FC<NewStepProps> = (props) => {

  return (
    <div className={styles.view}>
      <Header title="" backButton />
      <StepViewContent {...props} />
      <Footer />
    </div>
  );
};

export default StepView;