import React, { useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyPersonalDetails from './BodyPersonalDetails'
import styles from '../../styles.module.css'
import AddressView from '../../steps/AddressView'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../context'

const PersonalDetailsView: React.FC = () => {
  const { nextScreen } = useContext(NavContext);
  const { inputInterface } = useContext(APIContext);

  return (
    <div className={styles.view}>
      <Header title="Personal details" backButton />
      <BodyPersonalDetails
        onButtonAction={() => nextScreen(<AddressView />)}
        handleInputChange={inputInterface.handleInputChange}
      />
      <Footer />
    </div>
  );
};

export default PersonalDetailsView;