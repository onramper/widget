import React, { useContext } from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
import BodyBuyCrypto from './BodyBuyCrypto'
import styles from '../styles.module.css'
import PickView from '../PickView'
import ChooseGatewayView from '../ChooseGatewayView'

import { NavContext } from '../wrappers/context'
import { APIContext } from '../wrappers/APIContext'

const BuyCryptoView: React.FC = () => {
  const { nextScreen } = useContext(NavContext);
  const { data, api } = useContext(APIContext);

  return (
    <div className={styles.view}>
      <Header title="Buy crypto" />
      <BodyBuyCrypto
        onBuyCrypto={() => nextScreen(<ChooseGatewayView />)}
        openPickCrypto={() => nextScreen(<PickView title="Select cryptocurrency" items={data.aviableCryptos} />)}
        openPickCurrency={() => nextScreen(<PickView title="Select fiat currency" items={data.aviableCurrencies} />)}
        openPickPayment={() => nextScreen(<PickView title="Select payment method" items={data.aviablePaymentMethods} />)}
        selectedCrypto={data.aviableCryptos[0]}
        selectedCurrency={data.aviableCurrencies[0]}
        selectedPaymentMethod={data.aviablePaymentMethods[0]}
        handleInputChange={api.handleInputChange}
      />
      <Footer />
    </div>
  );
};

export default BuyCryptoView;