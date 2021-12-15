import React, { useCallback } from "react";
import styles from "./Input.module.css";
import { InputProps } from "./Input.models";
import InputTransition from "./InputTransition";

// TODO: add a component that uses this one to create a date input
const InputText = React.forwardRef<HTMLDivElement, InputProps>((props, ref) => {
  const {
    symbol,
    label = "\u00A0",
    className,
    disabled,
    value,
    type = "text",
    name,
    error,
    symbolPosition = "end",
    hint,
  } = props;

  const placeholder = disabled ? "" : props.placeholder;
  const clickableIcon = !!(props.clickableIcon || props.onIconClick);
  const { onIconClick } = props;
  const icon = props.icon;
  const iconPosition = props.iconPosition;
  const classPrefix = "--chevron";
  const transitionRef = React.createRef<HTMLDivElement>();

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

  const formatValue = (value?: any, type?: string) => {
    return value;
  };

  const _onIconClick = () => {
    onIconClick?.(name, formatValue(value, type), label);
  };

  // TODO: raname classes and rework css
  return (
    <div ref={ref} className={`${styles.input} ${className}`}>
      {label && (
        <label>
          <span>{label}</span>
          {!props.isRequired && (
            // TODO:  add a class here instead
            <span style={{ fontSize: ".75rem", opacity: ".75" }}>&nbsp;(Optional)</span>
          )}
        </label>
      )}

      <div
        className={`${styles.input__type} ${styles["input__type--number"]}  ${
          error || error === "" ? styles["input__type--number--error"] : ""
        } ${disabled ? styles["input__type--number--disabled"] : ""}`}
      >
        {icon && (
          <img
            title={props.iconTitle}
            onClick={_onIconClick}
            alt="Icon"
            src={icon}
            className={`${styles.input__type__child} ${styles.input__icon} ${
              iconPosition === "end"
                ? `${styles["input__type__child--old-first"]} ${
                    styles["input__icon" + classPrefix]
                  }`
                : ""
            } ${clickableIcon ? styles["clickable-icon"] : ""}`}
            data-value={value}
          />
        )}
        
        <span
          before-content={symbolPosition === "start" ? symbol : undefined}
          after-content={symbolPosition === "end" ? symbol : undefined}
          className={`${styles.input__type__child} ${styles.symbol}  ${
            iconPosition === "end" ? styles["input__type__child--new-first"] : ""
          }`}
          style={{ order: iconPosition === "end" ? -1 : "unset" }}
        >
          <input
            type={type}
            name={name}
            value={formatValue(value, type) ?? ""}
            onChange={(e) => handleInputChange(e)}
            placeholder={placeholder}
            disabled={disabled}
            max={props.max}
            min="0"
            maxLength={props.maxLength}
          />
        </span>
      </div>

      <InputTransition ref={transitionRef} in={!!error}>
        {error ? (
          <span ref={transitionRef} className={`${styles["text-error"]}`}>
            {error}
          </span>
        ) : (
          <></>
        )}
      </InputTransition>

      {hint && (
        <span
          onClick={props.onHintClick}
          className={`${styles["text-hint"]} ${props.onHintClick ? styles["text-hint--link"] : ""}`}
        >
          {hint}
        </span>
      )}

      <InputTransition nodeRef={transitionRef} in={!!props.info}>
        <span className={`${styles["text-hint"]}`}>{props.info}</span>
      </InputTransition>
    </div>
  );
});

// TODO: see why default props are used twice
InputText.defaultProps = {
  label: "\u00A0",
  className: "",
  iconPosition: "start",
  disabled: false,
  type: "text",
  isRequired: true,
};

export default InputText;
