import React, { useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyUpload from './BodyUpload'
import styles from '../../styles.module.css'
import ConfirmPaymentView from '../ConfirmPaymentView'

import { NavContext } from '../../wrappers/context'

const UploadView: React.FC = () => {
  const { nextScreen } = useContext(NavContext);
  const textInfo = 'Take a photo of the front and back of your passport and attach it here so we can verify your address (one file for each side).'

  return (
    <div className={styles.view}>
      <Header title="Upload passport photo" backButton />
      <BodyUpload
        onActionButton={() => nextScreen(<ConfirmPaymentView />)}
        textInfo={textInfo}
      />
      <Footer />
    </div>
  );
};

export default UploadView;