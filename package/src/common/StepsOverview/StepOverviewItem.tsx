import * as React from "react";
import classes from "./StepsOverview.module.css";
import commonClasses from "../.../../../styles.module.css";
import { StepOverviewItemProps } from "./StepsOverview.models";
import { CSSTransition } from "react-transition-group";
import InfoMessage from "./InfoMessage";
import StepOverviewDetailItem from "./StepOverviewDetailItem";
import { transitionClasses } from "./constants";
import { ReactComponent as ChevronRightIcon } from "./../../icons/chevron-right.svg";

const StepOverviewItem: React.FC<StepOverviewItemProps> = (props) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const transitionRef = React.useRef<HTMLDivElement>(null);

  const onClick = () => {
    if (props.items?.length) {
      setIsExpanded(!isExpanded);
    }
    props.onClick && props.onClick();
  };

  const computeStyle = React.useCallback(() => {
    return props.iconBgColor
      ? ({
          "--icon-bg-color": props.iconBgColor,
          "--icon-padding": "5px"
        } as React.CSSProperties)
      : {};
  }, [props.iconBgColor]);

  const computeMainItemClassName = React.useCallback(
    () =>
      `${classes["item"]} ${classes["border-left"]} ${props.className || ""} ${
        props.isSingleChild ? classes["single-child"] : ""
      } ${isExpanded ? classes["is-expanded"] : ""}`,
    [isExpanded, props.className, props.isSingleChild]
  );

  const isExpandable = !!props.items?.length;

  const iconClassName = `${classes["icon-wrapper"]} ${
    commonClasses["flex-all"]
  } ${isExpandable ? commonClasses["cursor-pointer"] : ""}`;

  return (
    <React.Fragment>
      <li
        className={computeMainItemClassName()}
        style={computeStyle()}
      >
        <div
          className={iconClassName}
          itemProp="icon-wrapper"
          onClick={onClick}
        >
          {typeof props.icon === "string" ? (
            <img src={props.icon} alt="Icon item" itemProp="icon" />
          ) : (
            props.icon
          )}
        </div>

        <div
          className={`${classes.content} ${
            isExpandable ? commonClasses["cursor-pointer"] : ""
          }`}
          onClick={onClick}
        >
          <div className={classes.description}>{props.description}</div>
          <div className={classes.title}>{props.title}</div>

          {isExpandable && (
            <ChevronRightIcon
              className={`${classes["chevron"]} ${
                isExpanded ? classes["up"] : ""
              }`}
            />
          )}

          {props.info && <InfoMessage content={props.info} />}
        </div>
      </li>

      <CSSTransition
        nodeRef={transitionRef}
        in={isExpanded}
        timeout={500}
        classNames={transitionClasses}
        unmountOnExit
        onEnter={() => setIsExpanded(true)}
        onExited={() => setIsExpanded(false)}
      >
        <div ref={transitionRef} className={classes["details-container"]}>
          {props.items &&
            props.items.map((item, index) => (
              <StepOverviewDetailItem {...item} key={index} />
            ))}
        </div>
      </CSSTransition>
    </React.Fragment>
  );
};

export default StepOverviewItem;
