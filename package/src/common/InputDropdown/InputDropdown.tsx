import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./InputDropdown.module.css";
import commonStyles from "./../../styles.module.css";
import { idGenerator } from "../../utils";
import { InputDropdownProps } from "./InputDropdown.models";
import DropdownHandle from "../DropdownHandle/DropdownHandle";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { ReactComponent as EditIcon } from "./../../icons/pencil.svg";

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${styles["wrapper"]} ${className || ""}`}>
    <div
      className={`${styles["content-wrapper"]} ${commonStyles["skeleton-box"]}`}
    ></div>
  </div>
);

const InputDropdown: React.FC<InputDropdownProps> = (
  props: InputDropdownProps
) => {
  const [id] = React.useState(idGenerator());
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const resizeInput = useCallback((target: HTMLInputElement) => {
    target.style.width = `0px`;
    target.style.width = `${target.scrollWidth}px`;
  }, []);

  const activateInput = useCallback(() => {
    if (props.readonly) {
      return;
    }
    setIsEditing(true);
  }, [props.readonly]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  if (props.isInitialLoading) {
    return <Skeleton className={props.className} />;
  }

  return (
    <div
      className={`${styles["wrapper"]} ${
        props.error ? styles["has-error"] : ""
      } ${props.className || ""}`}
    >
      <div className={styles["content-wrapper"]}>
        <div className={styles["input-section"]}>
          <label htmlFor={id} className={styles["label"]}>
            {props.label}
          </label>
          <div className={styles["input-wrapper"]}>
            {!isEditing && (
              <div
                onClick={activateInput}
                className={`${styles["common-txt"]} ${styles["value-text"]}`}
              >
                {props.value}
              </div>
            )}
            {isEditing && (
              <input
                ref={(node) => {
                  node && resizeInput(node);
                  inputRef.current = node;
                }}
                disabled={props.disabled}
                onFocus={props.onFocus || (() => {})}
                onBlur={() => setIsEditing(false)}
                onChange={props.onChange}
                type="text"
                id={id}
                value={props.value}
                className={`${styles["common-txt"]} ${styles["input"]}`}
              />
            )}
            <div className={styles["input-right"]}>
              {props.suffix && (
                <div className={`${styles["child"]} ${styles["suffix"]}`}>
                  {props.suffix}
                </div>
              )}
              {props.useEditIcon && (
                <EditIcon
                  onClick={activateInput}
                  className={`${styles["child"]} ${styles["edit-icon"]}`}
                />
              )}
            </div>
          </div>

          <div className={styles["hint-section"]}>
            {props.hint && (
              <div className={`${styles["child"]} ${styles["hint"]}`}>
                {props.hint}
              </div>
            )}
            {props.onMaxClick && (
              <button
                className={`${styles["child"]} ${styles["aux-button"]}`}
                onClick={props.onMaxClick}
              >
                Max
              </button>
            )}
          </div>
        </div>
        <DropdownHandle
          {...props.handleProps}
          className={styles["dropdown-handle"]}
        />
      </div>

      <ErrorMessage text={props.error} className={styles["error-wrapper"]} />
    </div>
  );
};

export default InputDropdown;
