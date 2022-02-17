import React, { useCallback, useContext, useState } from "react";
import { NavContext } from "../../NavContext";
import WalletInput from "../../steps/DestinationWalletView/WalletInput/WalletInput";
import TransactionErrorOverlay from "./TransactionErrorOverlay";
import { TransactionErrorOverlayProps } from "./TransactionErrorOverlay.models";

const errorProps = {
  rejected: {
    textAlert: "Rejected transaction",
    description: "You rejected this transaction. ",
  },
  deadline: {
    textAlert: "Deadline set too low",
    description:
      "Transaction timed out. To avoid a failed transaction try increasing the deadline time.",
  },
  slippage: {
    textAlert: "Slippage set too low",
    description:
      " Insufficient output amount. To avoid a failed transaction try setting the slippage higher.",
  },
} as { [key: string]: TransactionErrorOverlayProps };

const TemporarTransactionErrorTrigger: React.FC<{}> = () => {
  const [value, setValue] = useState("");
  const { nextScreen } = useContext(NavContext);

  const onEnter = useCallback(() => {
    if (errorProps[value]) {
      nextScreen(<TransactionErrorOverlay {...errorProps[value]} />);
    }
  }, [nextScreen, value]);

  return (
    <div style={{ padding: `var(--padding-top) var(--padding-rl)` }}>
      <div style={{paddingBottom: "10px"}}>
        Type one of the following{" "}
        {Object.entries(errorProps)
          .map(([name]) => `'${name}'`)
          .join(",")}
        <br/>(then enter)
      </div>
      <WalletInput
        onSubmit={() => onEnter()}
        value={value}
        onChange={setValue}
      />
    </div>
  );
};

export default TemporarTransactionErrorTrigger;
