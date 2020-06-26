import React, { useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyUpload from './BodyUpload'
import styles from '../../styles.module.css'
import ChooseGatewayView from '../../ChooseGatewayView'

import { NavContext } from '../../wrappers/context'

const UploadView: React.FC = () => {
  const { nextScreen } = useContext(NavContext);
  const textInfo = 'Examples of an address proof document are utility bills, bank, building society or credit card statement (less than 3 months old).'

  return (
    <div className={styles.view}>
      <Header title="Upload proof of address" backButton />
      <BodyUpload
        onButtonAction={() => nextScreen(<ChooseGatewayView />)}
        textInfo={textInfo}
      />
      <Footer />
    </div>
  );
};

export default UploadView;