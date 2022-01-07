import React, { useCallback } from "react";
import classes from "./BaseInput.module.css";
import { BaseInputProps } from "./BaseInput.models";
import InputTransition from "./BaseInputTransition";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

// TODO: style according to new design
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
    } ${clickableIcon ? classes["clickable-icon"] : ""}`;
  }, [props.clickableIcon, props.iconClassName, props.iconPosition, props.onIconClick]);

  const getInputWrapperChildClass = useCallback(() => {
    return `${classes["input-wrapper-child"]} ${classes.symbol}  ${
      props.iconPosition === "end" ? classes["with-right-icon"] : ""
    }`;
  }, [props.iconPosition]);

  const formatValue = (value?: any) => {
    if(props.formatValue) {
      return props.formatValue(value);
    }
    return value;
  };

  const onIconClick = () => {
    props.onIconClick?.(props.name, formatValue(props.value), label);
  };

  return (
    <div ref={ref} className={`${classes.wrapper} ${props.className}`}>
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
        {props.icon && (
          <img
            src={props.icon}
            className={getIconClasName()}
            onClick={onIconClick}
            title={props.iconTitle}
            data-value={props.value}
            alt="Icon"
          />
        )}

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
              placeholder={props.disabled ? "" : props.placeholder}
              disabled={props.disabled}
              max={props.max}
              min="0"
              maxLength={props.maxLength}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onMouseOver={() => setIsMouseOver(true)}
              onMouseOut={() => setIsMouseOver(false)}
            />
          ) : (
            <> {props.inputSupportFallbackNode} </>
          )}
        </span>
      </div>

      <ErrorMessage text={props.error} className={`${classes["text-error"]}`}/>

      {props.hint && (
        <span
          onClick={props.onHintClick}
          className={`${classes["text-hint"]} ${props.onHintClick ? classes["with-link"] : ""}`}
        >
          {props.hint}
        </span>
      )}

      <InputTransition nodeRef={transitionRef} in={!!props.info}>
        <span className={`${classes["text-hint"]}`}>{props.info}</span>
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