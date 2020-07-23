import React, { useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyVerifyCode from './BodyVerifyCode'
import styles from '../../styles.module.css'
import ChooseGatewayView from '../../ChooseGatewayView'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../context'

const VerifyCodeView: React.FC<{ name: string, codeType: string }> = ({ name, codeType }) => {
  const { nextScreen, backScreen } = useContext(NavContext);
  const { inputInterface, collected } = useContext(APIContext);
  const codeSentTo = collected[codeType]
  const textInfo = `We sent a verification code to ${codeSentTo}. Please enter the verification code below.`
  return (
    <div className={styles.view}>
      <Header title={`Verify ${name}`} backButton />
      <BodyVerifyCode
        textInfo={textInfo}
        onButtonAction={() => nextScreen(<ChooseGatewayView />)}
        onResendClick={() => backScreen()}
        handleInputChange={inputInterface.handleInputChange}
      />
      <Footer />
    </div>
  );
};

export default VerifyCodeView;