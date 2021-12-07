import React, { useContext, useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react'
import stylesCommon from '../styles.module.css'

import InputButton from '../common/Input/InputButton'
import InputTextAmount from '../common/Input/InputTextAmount'
import ButtonAction from '../common/ButtonAction'
import ExpectedCrypto from './ExpectedCrypto'

import { APIContext, GatewayRateOption, ItemCategory } from '../ApiContext'
import type { ItemType } from '../ApiContext'
import { NavContext } from '../NavContext'

import PaymentMethodPicker from './PaymentMethodPicker/PaymentMethodPicker'
import GatewayIndicator from './GatewayIndicator/GatewayIndicator'
import { IGatewaySelected } from './GatewayIndicator/GatewayIndicator.models'
import errorTypes from "./../ApiContext/api/errorTypes";
import TopScreenB2 from './TopScreenB2/TopScreenB2'
import NotificationSection from './NotificationSection/NotificationSection'
import Step from "./../steps/Step"
import TopScreenA from './ScreenA/TopScreenA'
import { getBestAvailableGateway } from '../utils'

interface BodyBuyCryptoProps {
    onBuyCrypto: () => void
    openPickCrypto?: () => void
    openPickCurrency?: () => void
    openPickPayment?: () => void
    selectedCrypto?: ItemType
    selectedCurrency?: ItemType
    selectedPaymentMethod?: ItemType
    handleInputChange: (name: string, value: any) => void
    isFilled?: boolean,
    handlePaymentMethodChange: (item: ItemType) => void,
    initLoadingFinished: boolean
}

function mapGatewaySelectedToPicker(selectedGateway?: GatewayRateOption): (IGatewaySelected | undefined) {
  if(!selectedGateway) {
    return;
  }
  return {
      name: selectedGateway.name,
      icon: selectedGateway.icon || "",
      rate: selectedGateway.rate
  }
}

const BodyBuyCrypto: React.FC<BodyBuyCryptoProps> = (props) => {
    const { openPickCrypto, onBuyCrypto, openPickCurrency, openPickPayment } = props
    const { selectedCrypto = LoadingItem, selectedCurrency = LoadingItem, selectedPaymentMethod = LoadingItem, isFilled = true } = props
    const { handleInputChange } = props
    const { collected, data: {availablePaymentMethods, allRates} } = useContext(APIContext);
    const { triggerChat, nextScreen } = useContext(NavContext)

    const [pairs, setPairs] = useState<ItemType[]>()
    const [amountInCrypto, setAmountInCrypto] = useState<boolean>(collected.amountInCrypto??false)
    const [symbolRecentlyChanged, setSymbolRecentlyChanged] = useState(false)

    const [minMaxErrorsMsg, setMinMaxErrorsMsg] = useState<string>()
    const [isGatewayInitialLoading, setIsGatewayInitialLoading] = useState<boolean>(true);
    const [showScreenA, setShowScreenA] = useState(false);

    useEffect(() => {
        setMinMaxErrorsMsg(
            collected.errors?.RATE?.type === 'MIN'
                || collected.errors?.RATE?.type === 'MAX'
                ? collected.errors.RATE.message
                : undefined)
    }, [collected.errors])

    useEffect(() => {
        setPairs([selectedCurrency, selectedCrypto])
    }, [selectedCurrency, selectedCrypto])

    const handleSymbolChange = useCallback(
        (item: ItemType | undefined) => {
            if (item) {
                if (symbolRecentlyChanged) {
                    if (collected.bestExpectedCrypto !== 0)
                        handleInputChange('amount', collected.bestExpectedCrypto)
                    setSymbolRecentlyChanged(false)
                }
                handleInputChange('amountInCrypto', item.currencyType === ItemCategory.Crypto)
                setAmountInCrypto(item.currencyType === ItemCategory.Crypto)
            }
        }, [handleInputChange, collected.bestExpectedCrypto, symbolRecentlyChanged]
    )

    const isNextStepConfirmed = useCallback(() => {
      if(!collected.selectedGateway) return false;

      const nextStep = collected.selectedGateway?.nextStep;
      if (!nextStep) return false

      return (
        collected.selectedGateway.identifier === 'Wyre'
        && nextStep.type === 'form'
        && nextStep.data.some(field => field.name === 'ccNumber')
      )
    }, [collected.selectedGateway]);

    const onNextStep = useCallback(
      () =>
        !!collected.selectedGateway &&
        nextScreen(<Step nextStep={collected.selectedGateway.nextStep} isConfirmed={!isNextStepConfirmed()} />),
      [collected.selectedGateway, isNextStepConfirmed, nextScreen]
    );

    const firstRender = useRef(true)
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
            return
        }
        setSymbolRecentlyChanged(true)
    }, [collected.amountInCrypto])

    useEffect(() => {
      handleInputChange('selectedGateway', getBestAvailableGateway(allRates, !!collected.amountInCrypto));
    }, [allRates, collected.amountInCrypto, collected.selectedCrypto, collected.selectedCurrency, collected.selectedPaymentMethod, handleInputChange])
  
    useEffect(() => {
      if(isGatewayInitialLoading) {
        setIsGatewayInitialLoading(!props.initLoadingFinished || collected.isCalculatingAmount);
      }
    }, [props.initLoadingFinished, collected.isCalculatingAmount, isGatewayInitialLoading]);

    
    useLayoutEffect(() => {
      setShowScreenA(new URLSearchParams(window.location.search).get("showScreenA") === "1");
    }, []);

    return (
      <main className={stylesCommon.body}>
        <NotificationSection onBuyCrypto={onBuyCrypto} />

        {/* <InputButton
          onClick={openPickCrypto}
          className={stylesCommon.body__child}
          label="I want to buy"
          selectedOption={selectedCrypto.name}
          icon={selectedCrypto.icon}
          network={selectedCrypto.network}
        />

        <div
          className={`${stylesCommon.body__child} ${stylesCommon["row-fields"]}`}
        >
          <InputTextAmount
            error={minMaxErrorsMsg}
            name="amount"
            type="number"
            value={collected.amount}
            onChange={handleInputChange}
            className={`${stylesCommon["row-fields__child"]} ${stylesCommon.grow}`}
            label="Amount"
            symbol={selectedCurrency.symbol}
            placeholder="100"
            symbols={pairs}
            onSymbolChange={handleSymbolChange}
            disabled={!collected.isAmountEditable}
          />
          <InputButton
            onClick={openPickCurrency}
            className={stylesCommon["row-fields__child"]}
            label="Currency"
            selectedOption={selectedCurrency.name}
            icon={selectedCurrency.icon}
          />
        </div> */}

        {/* <InputButton onClick={openPickPayment} iconPosition="end" className={stylesCommon.body__child} label="Payment method" selectedOption={selectedPaymentMethod.name} icon={selectedPaymentMethod.icon} /> */}

        {/* <ExpectedCrypto
          className={`${stylesCommon.body__child} ${stylesCommon.grow}`}
          amountInCrypto={amountInCrypto}
          denom={amountInCrypto ? selectedCurrency.name : selectedCrypto.name}
          isLoading={collected.isCalculatingAmount}
        /> */}

        {showScreenA && <TopScreenA />}
        {!showScreenA && <TopScreenB2 />}

        <PaymentMethodPicker
          openMoreOptions={openPickPayment}
          selectedId={selectedPaymentMethod.id}
          items={availablePaymentMethods}
          onChange={props.handlePaymentMethodChange}
          isLoading={!props.initLoadingFinished || availablePaymentMethods.length === 0}
        />

        {(!!collected.selectedGateway || isGatewayInitialLoading) &&
          collected.errors?.RATE?.type !== errorTypes.NO_RATES && (
            <GatewayIndicator
              selectedGateway={mapGatewaySelectedToPicker(collected.selectedGateway)}
              unitCrypto={collected.selectedCrypto?.name}
              unitFiat={collected.selectedCurrency?.name}
              openMoreOptions={onBuyCrypto}
              isLoading={collected.isCalculatingAmount}
              isInitialLoading={isGatewayInitialLoading}
              amountInCrypto={!!collected.amountInCrypto}
            />
          )}

        <div className={`${stylesCommon["body__child-grow"]}`}>
          <ButtonAction
            onClick={onNextStep}
            text={`Buy ${selectedCrypto.name}`}
            disabled={
              !isFilled ||
              collected.isCalculatingAmount ||
              !!minMaxErrorsMsg ||
              [errorTypes.ALL_UNAVAILABLE, errorTypes.NO_RATES].indexOf(
                collected.errors?.RATE?.type || ""
              ) > -1
            }
          />
        </div>
      </main>
    );
}

const LOAGIND_TEXT = 'Loading...'
const LoadingItem: ItemType = {
    id: '',
    name: LOAGIND_TEXT,
}

export default BodyBuyCrypto