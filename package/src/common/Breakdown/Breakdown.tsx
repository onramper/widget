import React, { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import commonClasses from "../../styles.module.css";
import { ReactComponent as ChevronRightIcon } from "../../icons/chevron-right.svg";
import { ReactComponent as IconHint } from "../../icons/hint.svg";
import classes from "./Breakdown.module.css";
import { useTransactionContext } from "../../TransactionContext/hooks";
import { useFeeBreakdown } from "../../TransactionContext/hooks/useFeeBreakdown";
import { trimLargeNumber } from "../../utils";
import { nanoid } from "nanoid";

const transitionTimeout = 300;

const Breakdown = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemsWrapperRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { tokenIn, tokenOut, slippageTolerance } = useTransactionContext();
  useEffect(() => {
    const onClickEvent = (event: MouseEvent) => {
      if (!event.target || wrapperRef.current?.contains(event.target as Node)) {
        return;
      }
      setIsExpanded(false);
    };

    window.addEventListener("click", onClickEvent);
    return () => {
      window.removeEventListener("click", onClickEvent);
    };
  }, []);

  const { inAmount, totalGas, minimumOutput, fees } = useFeeBreakdown();

  return (
    <div
      ref={wrapperRef}
      style={
        {
          "--transition-timeout": `${transitionTimeout}ms`,
        } as React.CSSProperties
      }
      className={`${classes["wrapper"]} ${
        isExpanded ? classes["expanded"] : ""
      }`}
    >
      <div className={classes["inner-wrapper"]}>
        <div
          className={classes["activator-section"]}
          onClick={() => setIsExpanded((value) => !value)}
        >
          <div className={classes["label"]}>Fee Breakdown:</div>
          <ChevronRightIcon
            className={`${commonClasses["chevron"]} ${
              isExpanded ? commonClasses["up"] : ""
            } ${classes["chevron"]}`}
          />
        </div>
        <Transition ref={itemsWrapperRef} in={isExpanded}>
          <div ref={itemsWrapperRef} className={classes["items-wrapper"]}>
            <div className={classes["items-group"]}>
              <FeeItem
                strong
                label={inAmount.label}
                amount={inAmount.amount}
                trimDecimals={6}
                symbol={tokenIn.symbol}
              />
              <FeeItem
                label={totalGas.label}
                amount={totalGas.amount}
                trimDecimals={0}
                symbol={"gwei"}
              />
              {fees &&
                fees.length > 0 &&
                fees.map((fee) => (
                  <FeeItem
                    key={nanoid()}
                    label={fee.label}
                    amount={fee.amount}
                    trimDecimals={0}
                    symbol={"gwei"}
                  />
                ))}
              <FeeItem
                label={"slippage"}
                amount={slippageTolerance.toString()}
                trimDecimals={2}
                symbol={"%"}
                hint="slippage is the difference between a trade's expected price and the actual price at which the trade is executed."
              />
              <FeeItem
                strong
                label={minimumOutput.label}
                amount={minimumOutput.amount}
                trimDecimals={6}
                symbol={tokenOut.symbol}
              />
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
};

const FeeItem = ({
  strong = false,
  subLabel,
  hint,
  label,
  amount,
  trimDecimals,
  symbol,
}: {
  strong?: boolean;
  label: string;
  amount: string;
  trimDecimals: number;
  symbol: string;
  hint?: string;
  subLabel?: string;
}) => {
  return (
    <div className={`${classes["item"]} ${strong ? classes["strong"] : ""}`}>
      <div className={classes["item-label"]}>
        <div className={classes["item-main-label"]}>
          <span> {label} </span>
          {hint && (
            <span
              data-tooltip={hint}
              className={`${commonClasses["tooltip"]} ${classes["hint"]}`}
            >
              <IconHint />
            </span>
          )}
        </div>
        {subLabel && (
          <div className={classes["item-sec-label"]}>{subLabel}</div>
        )}
      </div>
      <div className={classes["item-value"]}>
        {`${trimLargeNumber(amount, trimDecimals)} ${symbol}`}
      </div>
    </div>
  );
};

const Transition = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{ in: boolean }>
>((props, ref) => {
  return (
    <CSSTransition
      nodeRef={ref}
      in={props.in}
      timeout={transitionTimeout}
      classNames={{
        enter: classes["collapse-enter"],
        enterActive: classes["collapse-enter-active"],
        exit: classes["collapse-exit"],
        exitActive: classes["collapse-exit-active"],
      }}
      unmountOnExit={true}
    >
      {props.children}
    </CSSTransition>
  );
});

export default Breakdown;
