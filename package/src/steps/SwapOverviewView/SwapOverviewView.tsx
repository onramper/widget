import React, { useCallback, useEffect, useRef, useState } from "react";
import commonClasses from "../../styles.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import Footer from "../../common/Footer";
import Heading from "../../common/Heading/Heading";
import classes from "./SwapOverviewView.module.css";
import ButtonAction from "../../common/Buttons/ButtonAction";
import { isMetamaskEnabled, lifiChains } from "layer2";
import { getLifiQuote } from "../../web3/lifi";
import {
  useEtherBalance,
  useSendTransaction,
  TransactionStatus,
} from "@usedapp/core";
import ButtonSecondary from "../../common/Buttons/ButtonSecondary";
import SwapDetailsBar from "./SwapDetailsBar/SwapDetailsBar";
import FeeBreakdown from "./FeeBreakdown/FeeBreakdown";
import { useWalletSupportRedirect, useConnectWallet } from "../../hooks";
import { useNav } from "../../NavContext";
import OrderCompleteView from "../OrderCompleteView/OrderCompleteView";
import EditSwapView from "./EditSwapView/EditSwapView";
import {
  useTransactionContext,
  useTransactionCtxActions,
} from "../../TransactionContext/hooks";
import { WidgetNotification } from "../WidgetNotification/WidgetNotification";
import {
  NotificationType,
  useWidgetNotifications,
} from "../../NotificationContext";
import TransactionErrorOverlay from "./TransactionErrorOverlay/TransactionErrorOverlay";
import { isErrorWithName, storeTransactionData } from "../../ApiContext/api";
import { SwapOverviewViewProps } from "./SwapOverviewView.models";
import { useLayer2 } from "../../web3/config";
import { formatEther } from "ethers/lib/utils";
import { useUpdateQuote } from "../../TransactionContext/hooks/useUpdateQuote";
import { useExecuteTransaction } from "../../TransactionContext/hooks/useExecuteTransaction";

const SwapOverviewView = ({
  nextStep: {
    customerGateway,
    progress,
    amountIn: initialAmountIn,
    amountOut: initialAmountOut,
    tokenIn: initialTokenIn,
    tokenOut: initialTokenOut,
    fiatSymbol: initialFiatSymbol,
    userId,
    txId,
  },
}: SwapOverviewViewProps) => {
  const { setQuote, setTransactionRequest, initialiseTransactionContext } =
    useTransactionCtxActions();

  const { account: metaAddress, active, chainId } = useLayer2();
  const balance = useEtherBalance(metaAddress);
  const {
    fiatSymbol,
    tokenIn,
    tokenOut,
    selectedWalletAddress,
    slippageTolerance,
    deadline,
    quote,
    inAmount,
    transactionRequest,
  } = useTransactionContext();

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
