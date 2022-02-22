import React, { useCallback, useContext, useState } from "react";
import { APIContext } from "../../ApiContext";
import ErrorView from "../../common/ErrorView";
import { NavContext } from "../../NavContext";
import Step from "../Step";
import { ConfrimSwapViewProps } from "./ConfrimSwapView.models";
import commonClasses from "../../styles.module.css";
import inputClasses from "../../common/InputDropdown/InputDropdown.module.css";
import classes from "./ConfrimSwapView.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import Footer from "../../common/Footer";
import ButtonAction from "../../common/Buttons/ButtonAction";
import Heading from "../../common/Heading/Heading";
import InputDropdown from "../../common/InputDropdown/InputDropdown";
import { onChangeFloat } from "../../utils";

const ConfrimSwapView: React.FC<ConfrimSwapViewProps> = ({ nextStep }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [spentValue, setSpentValue] = useState(nextStep.cryptoSpent.value);
  const [balance, setBalance] = useState(nextStep.cryptoSpent.balance);
  const [receivedValue, setReceivedValue] = useState(
    nextStep.cryptoReceived.value
  );
  const [, setLastCall] = useState<AbortController>();

  const [cryptoSpent] = useState(nextStep.cryptoSpent);
  const [cryptoReceived] = useState(nextStep.cryptoReceived);
  const { nextScreen } = useContext(NavContext);
  const { apiInterface } = useContext(APIContext);

  const onActionButton = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const newNextStep = await apiInterface.executeStep(nextStep, {});
      nextScreen(<Step nextStep={newNextStep} />);
    } catch (_error) {
      const error = _error as { fatal: any; message: string };
      if (error.fatal) {
        nextScreen(<ErrorView />);
        return;
      }
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  }, [apiInterface, nextScreen, nextStep]);

  const getAndUpdateAbortController = useCallback(() => {
    const newController = new AbortController();
    const { signal } = newController;

    setLastCall((currentController) => {
      currentController?.abort();
      return newController;
    });

    return signal;
  }, []);

  const updateReceivedValue = useCallback(
    (value: string) => {
      setSpentValue(value);

      const spendCryptoApi = (value: number) => {
        const signal = getAndUpdateAbortController();

        return new Promise<{
          balance: number;
          receivedCrypto: number;
        }>((resolve, reject) => {
          if (signal.aborted) {
            return reject(new DOMException("Aborted", "AbortError"));
          }

          const timeout = setTimeout(() => {
            // mock a conversion
            const fiatValue = value * 2711.36;
            const balance = (nextStep.cryptoSpent.balance || 0) - fiatValue;
            const receivedCrypto = fiatValue * 0.0000259158;

            if (balance < 0) {
              const error = new Error();
              error.name = "INSUFICIENT_FUNDS";
              error.message =
                "You have insufficient funds to complete this transaction";
              throw error;
            }
            resolve({
              balance: Number(balance.toFixed(4)),
              receivedCrypto: Number(receivedCrypto.toFixed(12)),
            });
          }, 300);

          signal.addEventListener("abort", () => {
            clearTimeout(timeout);
            reject(new DOMException("Aborted", "AbortError"));
          });
        });
      };

      const onUpdate = async () => {
        try {
          const response = await spendCryptoApi(Number(spentValue));
          setBalance(response.balance);
          setReceivedValue(response.receivedCrypto.toString());
        } catch (_err) {}
      };
      onUpdate();
    },
    [getAndUpdateAbortController, nextStep.cryptoSpent.balance, spentValue]
  );

  const onMaxClick = useCallback(async () => {
    const spendAllBalanceApi = () => {
      const signal = getAndUpdateAbortController();

      return new Promise<{
        spentCrypto: number;
        receivedCrypto: number;
      }>((resolve, reject) => {
        if (signal.aborted) {
          return reject(new DOMException("Aborted", "AbortError"));
        }

        const timeout = setTimeout(() => {
          // mock a conversion
          const receivedCrypto =
            (nextStep.cryptoSpent.balance || 0) * 0.0000259158;
          const spentCrypto = (nextStep.cryptoSpent.balance || 0) / 2711.36;
          resolve({
            spentCrypto: Number(spentCrypto.toFixed(12)),
            receivedCrypto: Number(receivedCrypto.toFixed(12)),
          });
        }, 300);

        signal.addEventListener("abort", () => {
          clearTimeout(timeout);
          reject(new DOMException("Aborted", "AbortError"));
        });
      });
    };

    try {
      const response = await spendAllBalanceApi();
      setBalance(0);
      setReceivedValue(response.receivedCrypto.toString());
      setSpentValue(response.spentCrypto.toString());
    } catch (_err) {}
  }, [getAndUpdateAbortController, nextStep.cryptoSpent.balance]);

  const isFilled = true;

  return (
    <div className={commonClasses.view}>
      <ProgressHeader percentage={nextStep.progress} useBackButton />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <Heading
          text={nextStep.heading}
          textSubHeading={nextStep.description}
        />

        {/* TODO: remove this and add actual error component */}
        {errorMessage && errorMessage}

        <InputDropdown
          label={cryptoSpent.label}
          value={spentValue}
          onChange={(e) => onChangeFloat(e, updateReceivedValue)}
          className={inputClasses["swap-screen"]}
          hint={`Balance: ${balance}`}
          onMaxClick={onMaxClick}
          suffix={`(${cryptoSpent.fiatSymbol}${cryptoSpent.fiatConversion})`}
          handleProps={{
            icon: cryptoSpent.icon,
            value: cryptoSpent.currencyName,
            disabled: true,
          }}
          useEditIcon={true}
        />

        <InputDropdown
          label={cryptoReceived.label}
          value={receivedValue}
          className={inputClasses["swap-screen"]}
          suffix={`(${cryptoReceived.fiatSymbol}${cryptoReceived.fiatConversion})`}
          handleProps={{
            icon: cryptoReceived.icon,
            value: cryptoReceived.currencyName,
            disabled: true,
          }}
          readonly
        />

        <div
          className={`${commonClasses["body-form-child"]} ${commonClasses["grow-col"]}`}
        >
          <ButtonAction
            onClick={onActionButton}
            text={isLoading ? "Sending..." : "Continue"}
            disabled={!isFilled || isLoading}
          />
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default ConfrimSwapView;
