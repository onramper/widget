import React, { useCallback } from "react";
import classes from "./BaseInput.module.css";
import { BaseInputProps } from "./BaseInput.models";
import InputTransition from "./BaseInputTransition";

// TODO: add a component that uses this one to create a date input
// TODO: style according to new design

const BaseInput = React.forwardRef<HTMLDivElement, BaseInputProps>((props, ref) => {
  const transitionRef = React.createRef<HTMLDivElement>();

  const { label = "\u00A0", type = "text", symbolPosition = "end" } = props;
  const placeholder = props.disabled ? "" : props.placeholder;
  const clickableIcon = !!(props.clickableIcon || props.onIconClick);

  const handleChangeNumber = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value === "" ? "" : +e.currentTarget.value;

      if (!value && value !== "") return false;

      props.onChange?.(e.currentTarget.name, value, e.currentTarget.type);
    },
    [props]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "number") {
        return handleChangeNumber(e);
      }

      const value = e.currentTarget.value === "" ? "" : e.currentTarget.value;
      props.onChange?.(e.currentTarget.name, value, e.currentTarget.type);
    },
    [handleChangeNumber, props, type]
  );

  // TODO: review how this can be used
  const formatValue = (value?: any, type?: string) => {
    return value;
  };

  const _onIconClick = () => {
    props.onIconClick?.(props.name, formatValue(props.value, type), label);
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
        className={`${classes["input-wrapper"]}  ${
          props.error || props.error === "" ? classes["input-wrapper-error"] : ""
        } ${props.disabled ? classes["input-wrapper-disabled"] : ""}`}
      >
        {props.icon && (
          <img
            src={props.icon}
            className={`${classes["input-wrapper-child"]} ${classes.input__icon} ${
              props.iconPosition === "end"
                ? `${classes["icon-left"]} ${classes["icon-chevron"]}`
                : ""
            } ${clickableIcon ? classes["clickable-icon"] : ""}`}
            onClick={_onIconClick}
            title={props.iconTitle}
            data-value={props.value}
            alt="Icon"
          />
        )}

        <span
          style={{ order: props.iconPosition === "end" ? -1 : "unset" }}
          className={`${classes["input-wrapper-child"]} ${classes.symbol}  ${
            props.iconPosition === "end" ? classes["input-wrapper-right-icon"] : ""
          }`}
          before-content={symbolPosition === "start" ? props.symbol : undefined}
          after-content={symbolPosition === "end" ? props.symbol : undefined}
        >
          <input
            type={type}
            name={props.name}
            value={formatValue(props.value, type) ?? ""}
            onChange={(e) => handleInputChange(e)}
            placeholder={placeholder}
            disabled={props.disabled}
            max={props.max}
            min="0"
            maxLength={props.maxLength}
          />
        </span>
      </div>

      <InputTransition ref={transitionRef} in={!!props.error}>
        {props.error ? (
          <span ref={transitionRef} className={`${classes["text-error"]}`}>
            {props.error}
          </span>
        ) : (
          <></>
        )}
      </InputTransition>

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
