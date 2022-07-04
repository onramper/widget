import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNav } from "../../../NavContext";
import { EditSwapViewProps } from "./EditSwapView.models";
import commonClasses from "../../../styles.module.css";
import inputClasses from "../../../common/InputDropdown/InputDropdown.module.css";
import ProgressHeader from "../../../common/Header/ProgressHeader/ProgressHeader";
import Footer from "../../../common/Footer";
import { ButtonAction } from "../../../common/Buttons";
import Heading from "../../../common/Heading/Heading";
import InputDropdown from "../../../common/InputDropdown/InputDropdown";
import {
  formatTokenAmount,
  onChangeFloat,
  trimLargeNumber,
} from "../../../utils";
import Breakdown from "../../../common/Breakdown/Breakdown";
import TransactionSettings from "../TransactionSettings/TransactionSettings";
import classes from "./EditSwapView.module.css";
import { useEtherBalance, useTokenBalance } from "@usedapp/core";
import { useDebouncedCallback } from "use-debounce";
import {
  useTransactionContext,
  useTransactionCtxActions,
} from "../../../TransactionContext/hooks";
import { utils } from "ethers";
import { useLayer2 } from "../../../web3/config";
import { useUpdateQuote } from "../../../TransactionContext/hooks/useUpdateQuote";
import {
  SingleNotification,
  WidgetNotification,
} from "../../WidgetNotification/WidgetNotification";
import {
  NotificationType,
  useWidgetNotifications,
} from "../../../NotificationContext";
import { nanoid } from "nanoid";

const insufficientFundsError =
  "You have insufficient funds to complete this transaction";

const EditSwapView: React.FC<EditSwapViewProps> = (props) => {
  const [swapErrorMessage, setSwapErrorMessage] = useState<string>();
  const { account } = useLayer2();
  const { addNotification, removeNotification } = useWidgetNotifications();
  const { inAmount, tokenIn, tokenOut, quote } = useTransactionContext();
  const [localInAmount, setLocalInAmount] = useState<string>(
    inAmount.toString()
  );
  const { updateInAmount } = useTransactionCtxActions();

  const ethBalance = useEtherBalance(account);
  const tokenOutBalance = useTokenBalance(tokenOut.address, account);

  const { backScreen } = useNav();
  const { updateQuote, loading: quoteLoading } = useUpdateQuote();
  const beforeUnLoadRef = useRef<AbortController>(new AbortController());
  const heading = `Swap ${tokenIn.name} (${tokenIn.symbol}) for ${tokenOut.name} (${tokenOut.symbol})`;
  const [notificationId, setNotificationId] = useState<string | undefined>();
  const debouncedUpdateQuote = useDebouncedCallback(updateQuote, 600);

  const insufficientFunds =
    ethBalance !== undefined &&
    Number(utils.formatEther(ethBalance)) < Number(localInAmount);

  useEffect(() => {
    if (Number(localInAmount) > 0 && !insufficientFunds) {
      debouncedUpdateQuote(
        Number(localInAmount),
        beforeUnLoadRef.current.signal
      );
    }
  }, [debouncedUpdateQuote, insufficientFunds, localInAmount]);

  const onMaxClick = useCallback(async () => {
    if (ethBalance) {
      setLocalInAmount(utils.formatEther(ethBalance));
    }
  }, [ethBalance]);

  const onBackClick = () => {
    onBeforeUnload();
    updateQuote(inAmount);
  };

  const handleContinue = () => {
    updateInAmount(Number(localInAmount));
    backScreen();
  };

  // useEffect(() => {
  //   setBreakdown(
  //     generateBreakdown(
  //       localQuote,
  //       cryptoReceived.symbol,
  //       Number(slippageTolerance),
  //       priceImpact
  //     )
  //   );
  // }, [cryptoReceived.symbol, localQuote, priceImpact, slippageTolerance]);

  const handleErrorMessage = useCallback(() => {
    if (!notificationId) {
      if (
        ethBalance &&
        Number(utils.formatEther(ethBalance)) < Number(localInAmount)
      ) {
        setSwapErrorMessage(insufficientFundsError);
        const id = nanoid();
        setNotificationId(id);
        addNotification({
          type: NotificationType.Warning,
          message: insufficientFundsError,
          shouldExpire: false,
          id: id,
        });
      }
    }
  }, [addNotification, ethBalance, localInAmount, notificationId]);

  const handleRemoveErrorMessage = useCallback(() => {
    if (notificationId) {
      setSwapErrorMessage(undefined);
      removeNotification(notificationId);
    }
  }, [notificationId, removeNotification]);

  useEffect(() => {
    if (insufficientFunds) {
      handleErrorMessage();
    } else {
      handleRemoveErrorMessage();
    }
  }, [handleErrorMessage, handleRemoveErrorMessage, insufficientFunds]);

  const formattedOutputAmount = quote?.toAmountMin
    ? formatTokenAmount(tokenOut, quote?.toAmountMin)
    : "0.000";

  const onBeforeUnload = () => {
    beforeUnLoadRef.current.abort();
  };

  useEffect(() => {
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      onBeforeUnload();
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  return (
    <div className={commonClasses.view}>
      <ProgressHeader
        onBackClick={onBackClick}
        percentage={props.progress}
        useBackButton
      />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <div className={classes["top-section"]}>
          <Heading className={classes.heading} text={heading} />
          <TransactionSettings className={classes["settings"]} />
        </div>
        <WidgetNotification />
        {/* <ErrorIndication message={swapErrorMessage} /> */}

        <InputDropdown
          label={"You spend"}
          value={localInAmount}
          onChange={(e) =>
            onChangeFloat(e, (value) => {
              setLocalInAmount(value);
            })
          }
          className={inputClasses["swap-screen"]}
          hint={`Balance: ${
            ethBalance ? utils.formatEther(ethBalance).slice(0, 5) : "0.00"
          }`}
          onMaxClick={onMaxClick}
          suffix={`($${quote?.fromAmountUSD ?? "0.00"})`}
          handleProps={{
            icon: tokenIn.logoURI,
            value: tokenIn.symbol,
            disabled: true,
          }}
          markedError={!!swapErrorMessage}
          useEditIcon={true}
        />

        <InputDropdown
          label={"You receive"}
          value={formattedOutputAmount}
          className={inputClasses["swap-screen"]}
          hint={`Balance: ${
            tokenOutBalance
              ? trimLargeNumber(formatTokenAmount(tokenOut, tokenOutBalance), 6)
              : "0.00"
          }`}
          suffix={`($${quote?.toAmountUSD ?? "0.00"})`}
          handleProps={{
            icon: tokenOut.logoURI,
            value: tokenOut.symbol,
            disabled: true,
          }}
          readonly
        />

        <div className={classes["bottom-fields"]}>
          <Breakdown />
          <SingleNotification
            className={classes.notification}
            notification={{
              type: NotificationType.Info,
              message:
                "Above mentioned figures are valid for 1 minute based upon current market rates.",
            }}
          />
        </div>

        <div
          className={`${commonClasses["body-form-child"]} ${commonClasses["grow-col"]}`}
        >
          <ButtonAction
            onClick={handleContinue}
            text={quoteLoading ? "Updating quote..." : "Continue"}
            disabled={
              !Number(localInAmount) ||
              !!swapErrorMessage ||
              quoteLoading ||
              insufficientFunds
            }
          />
          <Footer />
        </div>
      </main>
    </div>
  );
};

// const ErrorIndication: React.FC<{ message?: string }> = (props) => {
//   const [message, setMessage] = useState(props.message || "");
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (props.message) {
//       setMessage(props.message);
//     }
//   }, [props.message]);

//   return (
//     <CSSTransition
//       nodeRef={ref}
//       in={!!props.message}
//       timeout={200}
//       classNames={{
//         enter: commonClasses["collapse-enter"],
//         enterActive: commonClasses["collapse-enter-active"],
//         exit: commonClasses["collapse-exit"],
//         exitActive: commonClasses["collapse-exit-active"],
//       }}
//       mountOnEnter
//       unmountOnExit
//     >
//       <div className={classes["error-section"]} ref={ref}>
//         <IndicationItem error text={message} />
//       </div>
//     </CSSTransition>
//   );
// };
// const IndicationItem: React.FC<{ error?: boolean; text: string }> = (props) => {
//   return (
//     <div
//       className={`${classes["info-wrapper"]} ${
//         props.error ? classes["indication-error"] : ""
//       }`}
//     >
//       <HexExclamationIcon className={classes["exclamation-icon"]} />
//       <div className={classes["info-txt"]}>{props.text}</div>
//     </div>
//   );
// };

export default EditSwapView;
