import React, { useCallback } from "react";
import classes from "./BaseInput.module.css";
import { BaseInputProps } from "./BaseInput.models";
import InputTransition from "./BaseInputTransition";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import hintIcon from "../../../icons/hint.svg";
import infoIcon from "../../../icons/info.svg";

const BaseInput = React.forwardRef<HTMLDivElement, BaseInputProps>((props, ref) => {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  const [isMouseOver, setIsMouseOver] = React.useState<boolean>(false);
  const transitionRef = React.createRef<HTMLDivElement>();

  const { label = "\u00A0", type = "text", symbolPosition = "end" } = props;
  
  const getIconClasName = useCallback(() => {
    const clickableIcon = !!(props.clickableIcon || props.onIconClick);

    return `${classes["input-wrapper-child"]} ${classes["input-icon"]} ${
      props.iconPosition === "end"
        ? `${classes["icon-left"]} ${classes[props.iconClassName || "icon-chevron"]}`
        : ""
    } ${clickableIcon ? classes["clickable-icon"] : ""} ${props.externalIconClassName || ""}`;
  }, [props.clickableIcon, props.externalIconClassName, props.iconClassName, props.iconPosition, props.onIconClick]);

  const getInputWrapperChildClass = useCallback(() => {
    return `${classes["input-wrapper-child"]} ${
      classes.symbol} ${!props.symbol ? "" : classes[`symbol-position-${symbolPosition}`]
    }  ${
      props.iconPosition === "end" ? classes["with-right-icon"] : ""
    }`;
  }, [props.iconPosition, props.symbol, symbolPosition]);

  const formatValue = (value?: any) => {
    return value;
  };

  const onIconClick = () => {
    props.onIconClick?.(props.name, formatValue(props.value), label);
  };

  const renderIcon = () => {
    if (!props.icon) {
      return;
    }
    if(typeof props.icon === "string") {
      return (
        <img
          src={props.icon}
          className={getIconClasName()}
          onClick={onIconClick}
          title={props.iconTitle}
          data-value={props.value}
          alt="Icon"
        />
      );
    }

    return (
      <div
        className={getIconClasName()}
        onClick={onIconClick}
      > 
        {props.icon}
      </div>
    );
  };

  return (
    <div ref={ref} className={`${classes.wrapper} ${props.variant ? classes[props.variant] : ""} ${classes[props.align || "left"]} ${props.className}`}>
      {label && (
        <label>
          <span>{label}</span>
          {!props.isRequired && (
            <span className={classes["optional-txt"]}>&nbsp;(Optional)</span>
          )}
        </label>
      )}

      <div
        className={`${classes["input-wrapper"]} ${
          isMouseOver ? classes["input-wrapper-hovered"] : ""
        } ${
          isFocused ? classes["input-wrapper-focused"] : ""
        } ${
          props.error || props.error === "" ? classes["input-wrapper-error"] : ""
        } ${props.disabled ? classes["input-wrapper-disabled"] : ""}`}
      >
        {renderIcon()}

        <span
          style={{ order: props.iconPosition === "end" ? -1 : "unset" }}
          className={getInputWrapperChildClass()}
          before-content={symbolPosition === "start" ? props.symbol : undefined}
          after-content={symbolPosition === "end" ? props.symbol : undefined}
        >
          {!props.inputNotSupported ? (
            <input
              type={type}
              name={props.name}
              value={formatValue(props.value)}
              onChange={props.handleInputChange}
              onKeyUp={(e) => e.key === "Enter" && props.onEnter && props.onEnter()}
              placeholder={props.disabled ? "" : props.placeholder}
              disabled={props.disabled}
              max={props.max}
              min="0"
              maxLength={props.maxLength}
              onFocus={() => setIsFocused(true)}
              onBlur={() => { 
                props.onBlur && props.onBlur();
                setIsFocused(false);
              }}
              onMouseOver={() => setIsMouseOver(true)}
              onMouseOut={() => setIsMouseOver(false)}
              autoFocus={props.autoFocus}
            />
          ) : (
            <> {props.inputSupportFallbackNode} </>
          )}
        </span>
      </div>

      <ErrorMessage text={typeof props.error === "string" ? props.error : undefined} className={`${classes["text-error-wrapper"]}`}/>

      {props.hint && (
        <div className={`${classes["text-under"]} ${props.onHintClick ? classes["with-link"] : ""}`} onClick={props.onHintClick}>
            <img src={hintIcon} />
            <span> {props.hint}</span>
        </div>
        
      )}

      <InputTransition nodeRef={transitionRef} in={!!props.info}>
        <div className={`${classes["text-under"]}`} >
            <img src={infoIcon} />
            <span> {props.info}</span>
        </div>
      </InputTransition>
    </div>
  );
});

BaseInput.defaultProps = {
  label: "\u00A0",
  className: "",
  iconPosition: "start",
  disabled: false,
  type: "text",
  isRequired: true,
};

export default BaseInput;