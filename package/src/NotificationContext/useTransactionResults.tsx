import { Notification, TokenInfo, useNotifications } from "layer2";
import React, { useCallback, useEffect } from "react";
import { useNav } from "../NavContext";
import OrderCompleteView from "../steps/OrderCompleteView/OrderCompleteView";
import TransactionErrorOverlay from "../SwapCryptoView/TransactionErrorOverlay/TransactionErrorOverlay";

const isSuccess = (notifications: Notification[]): boolean =>
  notifications[notifications.length - 1].type === "transactionSucceed";
const isFailure = (notifications: Notification[]): boolean =>
  notifications[notifications.length - 1].type === "transactionFailed";

export const useTransactionResults = (tokenOut: TokenInfo) => {
  const { nextScreen } = useNav();
  const { removeNotification, notifications } = useNotifications();

  const CHIAN_ID = tokenOut.chainId;

  const handleSuccess = useCallback(() => {
    nextScreen(
      <OrderCompleteView
        title="Success! Your Swap has been executed."
        description="You will receive an email when the swap is complete and the crypto has arrived in your wallet. "
        tokenOut={tokenOut}
      />
    );
  }, [nextScreen, tokenOut]);

  const handleFailure = useCallback(
    (notification: Notification) => {
      if ("receipt" in notification) {
        nextScreen(
          <TransactionErrorOverlay
            onClose={() =>
              removeNotification({
                notificationId: notification.id,
                chainId: CHIAN_ID,
              })
            }
            textAlert="Slippage set too low"
            description="Insufficient output amount. To avoid a failed transaction try setting the slippage higher."
          />
        );
      }
    },
    [CHIAN_ID, nextScreen, removeNotification]
  );

  useEffect(() => {
    if (notifications.length > 0) {
      if (isSuccess(notifications)) {
        handleSuccess();
      } else if (isFailure(notifications)) {
        handleFailure(notifications[notifications.length - 1]);
      }
    }
  }, [handleFailure, handleSuccess, nextScreen, notifications, tokenOut]);
};
