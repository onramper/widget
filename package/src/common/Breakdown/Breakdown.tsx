import React, { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import commonClasses from "../../styles.module.css";
import { BreakdownProps } from "./Breakdown.models";
import { ReactComponent as ChevronRightIcon } from "../../icons/chevron-right.svg";
import { ReactComponent as IconHint } from "../../icons/hint.svg";
import classes from "./Breakdown.module.css";

const transitionTimeout = 300;

const Breakdown: React.FC<BreakdownProps> = (props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemsWrapperRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

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
          <div className={classes["label"]}>{props.label}</div>
          <ChevronRightIcon
            className={`${commonClasses["chevron"]} ${
              isExpanded ? commonClasses["up"] : ""
            } ${classes["chevron"]}`}
          />
        </div>
        <Transition ref={itemsWrapperRef} in={isExpanded}>
          <div ref={itemsWrapperRef} className={classes["items-wrapper"]}>
            {props.groups.map((items, index) => (
              <div key={index} className={classes["items-group"]}>
                {items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`${classes["item"]} ${
                      item.strong ? classes["strong"] : ""
                    }`}
                  >
                    <div className={classes["item-label"]}>
                      <div className={classes["item-main-label"]}>
                        <span> {item.label} </span>
                        {item.hint && (
                          <span
                            data-tooltip={item.hint}
                            className={`${commonClasses["tooltip"]} ${classes["hint"]}`}
                          >
                            <IconHint />
                          </span>
                        )}
                      </div>
                      {item.subLabel && <div className={classes["item-sec-label"]}>{item.subLabel}</div>}
                    </div>
                    <div className={classes["item-value"]}>{item.value}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Transition>
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
