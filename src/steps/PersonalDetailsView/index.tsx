import React, { useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyPersonalDetails from './BodyPersonalDetails'
import styles from '../../styles.module.css'
import ConfirmPaymentView from '../../steps/ConfirmPaymentView'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../wrappers/APIContext'

const PersonalDetailsView: React.FC = () => {
  const { nextScreen } = useContext(NavContext);
  const { inputInterface } = useContext(APIContext);

  return (
    <div className={styles.view}>
      <Header title="Personal details" backButton />
      <BodyPersonalDetails
        onButtonAction={() => nextScreen(<ConfirmPaymentView />)}
        handleInputChange={inputInterface.handleInputChange}
      />
      <Footer />
    </div>
  );
};

export default PersonalDetailsView;