import React, { useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyPersonalDetails from './BodyPersonalDetails'
import styles from '../../styles.module.css'
import ChooseGatewayView from '../../ChooseGatewayView'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../wrappers/APIContext'

const PersonalDetailsView: React.FC = () => {
  const { nextScreen } = useContext(NavContext);
  const { api } = useContext(APIContext);

  return (
    <div className={styles.view}>
      <Header title="Personal details" backButton/>
      <BodyPersonalDetails
        onButtonAction={() => nextScreen(<ChooseGatewayView />)}
        handleInputChange={api.handleInputChange}
      />
      <Footer />
    </div>
  );
};

export default PersonalDetailsView;