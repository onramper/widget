import React from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodySuccessView from './BodySuccessView'
import styles from '../../styles.module.css'

const SuccessView: React.FC = () => {

  return (
    <div className={styles.view}>
      <Header title="Purchase completed" backButton />
      <BodySuccessView />
      <Footer />
    </div>
  );
};

export default SuccessView;