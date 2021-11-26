import React, { useEffect, useState, useRef } from "react";
import { ItemType } from "../../ApiContext";
import { PaymentMethodPickerProps } from "./PaymentMethodPicker.models";
import styles from "./PaymentMethodPicker.module.css";
import commonStyles from "../../styles.module.css";

const Skeleton = React.forwardRef<
  HTMLUListElement,
  { maxLength: number }
>(({ maxLength }, ref) => {
  return (
    <>
      <div className={`${styles.title}`}>
        <span>Payment method</span>
      </div>

      <ul className={styles.wrapper} style={{ maxWidth: "100%" }} ref={ref}>
        {[...[1, 2, 3, 4, 5].slice(0, maxLength), 1].map((n: any, i: number) => (
          <li
            itemProp="option"
            key={i}
            className={`${styles["option-wrapper"]} ${commonStyles["skeleton-box"]} ${styles["skeloton-option"]}`}
          >
            <div className={styles["option-logo-wrapper"]}></div>
            <div className={styles["option-label"]}></div>
          </li>
        ))}
      </ul>
    </>
  );
});

const PaymentMethodPicker: React.FC<PaymentMethodPickerProps> = (
  props: PaymentMethodPickerProps
) => {
  const [maxLength, setMaxLength] = useState(2);
  const [items, setItems] = useState(props.items);

  const containerRef = useRef<HTMLUListElement>(null);
  const itemsLengthRef = useRef<Number>(items.length);

  const calculateDistribution = () => {
    if (itemsLengthRef.current === 1) {
      setMaxLength(1);
      return;
    }

    if (!containerRef.current) return;

    const optionNode = containerRef.current.querySelector(`[itemProp="option"]`);
    if (!optionNode) return;

    const marginRight = Number(getComputedStyle(optionNode).marginRight.replace("px", ""));
    const width = optionNode.getBoundingClientRect().width;

    const availableWidth = containerRef.current.clientWidth - width;
    const cellWidth = width + marginRight;

    const maxLengthAux = Math.floor(availableWidth / cellWidth);
    setMaxLength(maxLengthAux > 0 ? maxLengthAux : 0);
  };

  const setItemsAux = (list: ItemType[]) => {
    itemsLengthRef.current = list.length;
    setItems(list);
  };

  useEffect(() => {
    calculateDistribution();

    window.addEventListener("resize", calculateDistribution);
    return () => {
      window.removeEventListener("resize", calculateDistribution);
    };
  }, []);

  useEffect(() => {
    const getListWithSelected = (): ItemType[] => {
      const sourceList =
        props.items.length === items.length &&
        props.items.every((sItem: ItemType) => items.some((item) => item.id === sItem.id))
          ? items
          : props.items;

      if (!props.selectedId) return sourceList;

      if (sourceList.slice(0, maxLength).some((i: ItemType) => i.id === props.selectedId))
        return sourceList;

      const selected = sourceList.find((i: ItemType) => i.id === props.selectedId);
      if (!selected) return sourceList;

      return [selected, ...sourceList.filter((i: ItemType) => i.id !== props.selectedId)];
    };

    const newList = getListWithSelected();
    if (
      newList.length !== items.length ||
      !newList.every(
        (item: ItemType, index: number) =>
          items.findIndex((i: ItemType) => i.id === item.id) === index
      )
    ) {
      setItemsAux(newList);
      calculateDistribution();
    }
  }, [items, maxLength, props.items, props.selectedId]);

  if (props.isLoading) return <Skeleton maxLength={maxLength} ref={containerRef} />;

  return (
    <>
      <div className={styles.title}>Payment method</div>

      <ul ref={containerRef} className={styles.wrapper}>
        {items.slice(0, maxLength).map((item: ItemType, i: number) => (
          <li
            itemProp="option"
            key={i}
            className={`${styles["option-wrapper"]} ${
              item.id === props.selectedId ? " " + styles.selected : ""
            }`}
            onClick={() => props.onChange(item)}
          >
            {item.icon && (
              <div className={styles["option-logo-wrapper"]}>
                <img alt="Icon" src={item.icon} />
              </div>
            )}
            <div className={styles["option-label"]}> {item.name} </div>
          </li>
        ))}

        {maxLength < props.items.length && (
          <li
            itemProp="option"
            className={styles["option-wrapper"]}
            onClick={() => props.openMoreOptions && props.openMoreOptions()}
          >
            <div className={styles["option-logo-wrapper"]}>
              <span>+{props.items.length - maxLength}</span>
            </div>
            <div className={styles["option-label"]}> Other </div>
          </li>
        )}
      </ul>
    </>
  );
};

export default PaymentMethodPicker;
