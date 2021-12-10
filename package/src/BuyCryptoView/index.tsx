import React, { useContext, useEffect, useState } from "react";
import Header from "../common/Header";
import BodyBuyCrypto from "./BodyBuyCrypto";
import styles from "../styles.module.css";
import PickView from "../PickView";
import ChooseGatewayView from "../ChooseGatewayView";
import ErrorView from "../common/ErrorView";
import Step from "../steps/Step";
import { NavContext } from "../NavContext";
import { APIContext, ItemType, NextStep } from "../ApiContext";
import * as API from "../ApiContext/api";

const popularCrypto = ["BTC", "ETH", "USDT", "BNB_BEP20", "USDC"];

const BuyCryptoView: React.FC = () => {
  const [isFilled, setIsFilled] = useState(false);
  const [buyStep, setBuyStep] = useState<NextStep>();

  const { nextScreen, backScreen } = useContext(NavContext);
  const { data, inputInterface, collected, apiInterface } =
    useContext(APIContext);
  const [sortedCrypto, setSortedCrypto] = useState(data.availableCryptos);
  const {
    handleCryptoChange,
    handleCurrencyChange,
    handlePaymentMethodChange,
  } = data;
  const { init } = apiInterface;
  const { errors } = collected;

  //flagEffectInit used to call init again
  useEffect(() => {
    init();
  }, [init/* , flagEffectInit */]);

  const handleItemClick = (name: string, index: number, item: ItemType) => {
    if (name === "crypto") handleCryptoChange(item);
    else if (name === "currency") handleCurrencyChange(item);
    else if (name === "paymentMethod") handlePaymentMethodChange(item);

    backScreen();
  };

  //listening to errors sent by APIContext
  useEffect(() => {
    if (!errors || Object.keys(errors).length <= 0) return;
    const key = Object.keys(errors)[0] as keyof typeof errors;
    const type = errors?.[key]?.type;
    if (type && !["MIN", "MAX", "ALL_UNAVAILABLE", "NO_RATES"].includes(type))
      nextScreen(<ErrorView type={type} message={errors?.[key]?.message} />);
  }, [errors, nextScreen]);

  useEffect(() => {
    if (
      collected.selectedCrypto &&
      collected.selectedCurrency &&
      collected.selectedPaymentMethod &&
      collected.amount > 0
    )
      setIsFilled(true);
    else setIsFilled(false);
  }, [
    setIsFilled,
    collected.selectedCrypto,
    collected.selectedCurrency,
    collected.selectedPaymentMethod,
    collected.amount,
  ]);

  useEffect(() => {
    (async () => {
      try {
        const nextStep = await API.sell("BTC", 0.1, "blockchain", {
          amountInCrypto: true,
          country: collected.selectedCountry,
        });
        setBuyStep(nextStep.nextStep);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [collected.selectedCountry]);

  useEffect(() => {
    const auxSortedCrypto = popularCrypto
      .map((c) => data.availableCryptos.filter((crypto) => crypto.id === c)[0])
      .filter((c) => c !== undefined)
      .concat(
        data.availableCryptos
          .filter((crypto) => !popularCrypto.includes(crypto.id))
          .sort((a, b) => (a.id === b.id ? 0 : a.id > b.id ? 1 : -1))
      );
    setSortedCrypto(auxSortedCrypto);
  }, [data.availableCryptos]);

  return (
    <div className={styles.view}>
      <Header
        title="Buy crypto"
        secondaryTitle={
          buyStep && collected.supportSell ? "Sell crypto" : undefined
        }
        onSecondaryTitleClick={() => {
          nextScreen(<Step nextStep={buyStep} />);
        }}
      />
      <BodyBuyCrypto
        onBuyCrypto={() => nextScreen(<ChooseGatewayView />)}
        openPickCrypto={
          data.availableCryptos.length > 1
            ? () =>
                nextScreen(
                  <PickView
                    name="crypto"
                    title="Select cryptocurrency"
                    items={sortedCrypto}
                    onItemClick={handleItemClick}
                    searchable
                  />
                )
            : undefined
        }
        openPickCurrency={
          data.availableCurrencies.length > 1
            ? () =>
                nextScreen(
                  <PickView
                    name="currency"
                    title="Select fiat currency"
                    items={data.availableCurrencies}
                    onItemClick={handleItemClick}
                    searchable
                  />
                )
            : undefined
        }
        openPickPayment={
          data.availablePaymentMethods.length > 1
            ? () =>
                nextScreen(
                  <PickView
                    name="paymentMethod"
                    title="Select payment method"
                    items={data.availablePaymentMethods}
                    onItemClick={handleItemClick}
                  />
                )
            : undefined
        }
        selectedCrypto={collected.selectedCrypto}
        selectedCurrency={collected.selectedCurrency}
        selectedPaymentMethod={collected.selectedPaymentMethod}
        handleInputChange={inputInterface.handleInputChange}
        isFilled={isFilled}
      />
    </div>
  );
};

export default BuyCryptoView;
