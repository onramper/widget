import React, { useContext, useEffect, useState } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyVerifyCode from './BodyEmailView'
import styles from '../../styles.module.css'

/* import { NavContext } from '../../wrappers/context' */
import { APIContext } from '../../context'

/* import nextStep from '../nextStep' */

const EmailView: React.FC = () => {
/*   const { nextScreen } = useContext(NavContext); */
  const { inputInterface, collected, /* data, */ apiInterface } = useContext(APIContext);
  const [isFilled, setIsFilled] = useState(false)
  const [requestOk, setRequestOk] = useState(false)
  const textInfo = 'We will send a code to your email.'


  const handleButtonAction = async () => {
    const ok = await apiInterface.sendCodeEmail()
    setRequestOk(ok)
    console.log(requestOk)
  }

/*   useEffect(() => {
    if (requestOk) nextStep(nextScreen, data.nextStep)
  }, [requestOk, nextScreen, data.nextStep]) */

  useEffect(() => {
    const isFilled = collected.email ? true : false
    setIsFilled(isFilled)
  }, [collected.email])

  return (
    <div className={styles.view}>
      <Header title="Email" backButton />
      <BodyVerifyCode
        textInfo={textInfo}
        onActionButton={handleButtonAction}
        handleInputChange={inputInterface.handleInputChange}
        isFilled={isFilled}
      />
      <Footer />
    </div>
  );
};

export default EmailView;