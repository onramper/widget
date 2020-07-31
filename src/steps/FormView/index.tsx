import React, { useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyForm from './BodyFormView'
import styles from '../../styles.module.css'
import UploadView from '../UploadView'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../context'

const FormView: React.FC<{ fields: string[] }> = ({ fields }) => {
  const { nextScreen } = useContext(NavContext);
  const { inputInterface } = useContext(APIContext);

  return (
    <div className={styles.view}>
      <Header title="Purchase form" backButton />
      <BodyForm
        fields={fields}
        onActionButton={() => nextScreen(<UploadView />)}
        handleInputChange={inputInterface.handleInputChange}
      />
      <Footer />
    </div>
  );
};

export default FormView;