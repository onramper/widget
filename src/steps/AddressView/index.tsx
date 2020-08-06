import React, { useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyAddress from './BodyAddressView'
import styles from '../../styles.module.css'
import UploadView from '../UploadView'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../context'

const AddressView: React.FC = () => {
  const { nextScreen } = useContext(NavContext);
  const { inputInterface } = useContext(APIContext);

  return (
    <div className={styles.view}>
      <Header title="Personal details" backButton />
      <BodyAddress
        onActionButton={() => nextScreen(<UploadView nextStep={{ type: '', url: '', data: [] }} />)}
        handleInputChange={inputInterface.handleInputChange}
      />
      <Footer />
    </div>
  );
};

export default AddressView;