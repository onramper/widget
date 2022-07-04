import React, { useCallback, useEffect, useRef } from "react";
import commonClasses from "../../styles.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import Footer from "../../common/Footer";
import Heading from "../../common/Heading/Heading";
import classes from "./SwapOverviewView.module.css";
import { ButtonAction, ButtonSecondary } from "../../common/Buttons";
import { isMetamaskEnabled } from "layer2";
import SwapDetailsBar from "./SwapDetailsBar/SwapDetailsBar";
import FeeBreakdown from "./FeeBreakdown/FeeBreakdown";
import { useWalletSupportRedirect, useConnectWallet } from "../../hooks";
import { useNav } from "../../NavContext";
import EditSwapView from "./EditSwapView/EditSwapView";
import {
  useTransactionContext,
  useTransactionCtxActions,
} from "../../TransactionContext/hooks";
import { WidgetNotification } from "../WidgetNotification/WidgetNotification";
import { SwapOverviewViewProps } from "./SwapOverviewView.models";
import { useLayer2 } from "../../web3/config";
import { useUpdateQuote } from "../../TransactionContext/hooks/useUpdateQuote";
import { useExecuteTransaction } from "../../TransactionContext/hooks/useExecuteTransaction";

const SwapOverviewView = ({
  nextStep: {
    customerGateway,
    progress,
    amountIn: initialAmountIn,
    tokenIn: initialTokenIn,
    tokenOut: initialTokenOut,
    fiatSymbol: initialFiatSymbol,
    userId,
    txId,
  },
}: SwapOverviewViewProps) => {
  const { initialiseTransactionContext } = useTransactionCtxActions();

  const { account: metaAddress, active } = useLayer2();
  const { tokenIn, tokenOut } = useTransactionContext();

  // const { fetchAndUpdateUserWallets } = useTransactionCtxWallets();

  const isActive = metaAddress && active;
  useWalletSupportRedirect(progress);
  const { connect, connectionPending } = useConnectWallet();
  const { nextScreen } = useNav();

  const { updateQuote, loading: quoteLoading } = useUpdateQuote();
  const { executeTransaction, loading: transactionLoading } =
    useExecuteTransaction();
  const beforeUnLoadRef = useRef<AbortController>(new AbortController());

  useEffect(() => {
    initialiseTransactionContext({
      customerGateway: customerGateway,
      txId,
      userId,
      tokenIn: initialTokenIn,
      tokenOut: initialTokenOut,
      fiatSymbol: initialFiatSymbol,
      inAmount: initialAmountIn,
    });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    updateQuote(initialAmountIn, beforeUnLoadRef.current.signal);
  }, [initialAmountIn, updateQuote]);

  const heading = `Swap ${tokenIn.name} (${tokenIn.symbol}) for ${tokenOut.name} (${tokenOut.symbol})`;

  const handleEdit = useCallback(async () => {
    nextScreen(<EditSwapView progress={progress} />);
  }, [nextScreen, progress]);

  useEffect(() => {
    const onBeforeUnload = () => {
      beforeUnLoadRef.current.abort();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      onBeforeUnload();
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  return (
    <div className={commonClasses.view}>
      <ProgressHeader noSeparator useBackButton percentage={progress} />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <Heading className={classes.heading} text={heading} />
        <WidgetNotification />
        <SwapDetailsBar />
        <FeeBreakdown />
        <div className={classes.buttonContainer}>
          {isActive ? (
            <>
              <ButtonSecondary
                className={classes.buttonInGroup}
                text="Edit"
                onClick={handleEdit}
                disabled={transactionLoading}
              />
              <ButtonAction
                disabled={!isActive || transactionLoading || quoteLoading}
                className={classes.buttonInGroup}
                text={"Confirm Swap"}
                onClick={executeTransaction}
                pending={transactionLoading || quoteLoading}
              />
            </>
          ) : (
            <ButtonAction
              text="Connect Wallet"
              pending={connectionPending}
              onClick={connect}
              disabled={!isMetamaskEnabled() || connectionPending}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SwapOverviewView;
