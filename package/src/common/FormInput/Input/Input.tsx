import React, { useCallback } from "react";
import styles from "./Input.module.css";
import { InputProps } from "./Input.models";
import InputTransition from "./InputTransition";

// TODO: add a component that uses this one to create a date input
const InputText = React.forwardRef<HTMLDivElement, InputProps>((props, ref) => {
  const transitionRef = React.createRef<HTMLDivElement>();

  const {
    label = "\u00A0",
    type = "text",
    symbolPosition = "end"
  } = props;
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

  // TODO: raname classes and rework css
  return (
    <div ref={ref} className={`${styles.input} ${props.className}`}>
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
          props.error || props.error === "" ? styles["input__type--number--error"] : ""
        } ${props.disabled ? styles["input__type--number--disabled"] : ""}`}
      >
        {props.icon && (
          <img
            title={props.iconTitle}
            onClick={_onIconClick}
            alt="Icon"
            src={props.icon}
            className={`${styles.input__type__child} ${styles.input__icon} ${
              props.iconPosition === "end"
                ? `${styles["input__type__child--old-first"]} ${
                    styles["input__icon--chevron"]
                  }`
                : ""
            } ${clickableIcon ? styles["clickable-icon"] : ""}`}
            data-value={props.value}
          />
        )}
        
        <span
          before-content={symbolPosition === "start" ? props.symbol : undefined}
          after-content={symbolPosition === "end" ? props.symbol : undefined}
          className={`${styles.input__type__child} ${styles.symbol}  ${
            props.iconPosition === "end" ? styles["input__type__child--new-first"] : ""
          }`}
          style={{ order: props.iconPosition === "end" ? -1 : "unset" }}
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
          <span ref={transitionRef} className={`${styles["text-error"]}`}>
            {props.error}
          </span>
        ) : (
          <></>
        )}
      </InputTransition>

      {props.hint && (
        <span
          onClick={props.onHintClick}
          className={`${styles["text-hint"]} ${props.onHintClick ? styles["text-hint--link"] : ""}`}
        >
          {props.hint}
        </span>
      )}

      <InputTransition nodeRef={transitionRef} in={!!props.info}>
        <span className={`${styles["text-hint"]}`}>{props.info}</span>
      </InputTransition>
    </div>
  );
});

InputText.defaultProps = {
  label: "\u00A0",
  className: "",
  iconPosition: "start",
  disabled: false,
  type: "text",
  isRequired: true
};

export default InputText;
