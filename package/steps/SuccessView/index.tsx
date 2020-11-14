import React from 'react';
import Header from '../../common/Header'
import BodySuccessView from './BodySuccessView'
import styles from '../../styles.module.css'

const SuccessView: React.FC<{ txType: "instant" | "pending" }> = ({ txType }) => {

  return (
    <div className={styles.view}>
      <Header title={txType === 'instant' ? "Order processed" : "Order registred"} backButton={txType !== 'instant'} />
      <BodySuccessView txType={txType} />
    </div>
  );
};

export default SuccessView;