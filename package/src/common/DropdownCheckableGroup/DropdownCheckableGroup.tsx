import React, { useEffect, useRef, useState } from "react";
import {
  DropdownCheckableGroupProps,
  ListItem,
} from "./DropdownCheckableGroup.models";
import commonClasses from "../../styles.module.css";
import classes from "./DropdownCheckableGroup.module.css";
import { ReactComponent as ChevronRightIcon } from "../../icons/chevron-right.svg";
import { CSSTransition } from "react-transition-group";
import DropdownItem from "./DropdownItem";

const DropdownCheckableGroup: React.FC<DropdownCheckableGroupProps> = (
  props
) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [items, setItems] = useState(
    withSelectedFirst(props.items, props.idSelected)
  );
  const expandableWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems(withSelectedFirst(props.items, props.idSelected));
  }, [props.items, props.idSelected]);

  if (!props.items.length) {
    return (
      <button
        onClick={props.onAdd}
        className={`${commonClasses["secondary-btn"]} ${classes["add-btn"]}`}
      >
        {props.addNewBtnText}
      </button>
    );
  }

  return (
    <div className={classes["wrapper"]}>
      <DropdownItem
        {...items[0]}
        isCheckHidden={!isExpanded}
        onClick={() => setIsExpanded((value) => !value)}
        isChecked={true}
        iconRight={
          <ChevronRightIcon
            className={`${commonClasses["chevron"]} ${
              isExpanded ? commonClasses["up"] : ""
            } ${classes["chevron"]}`}
          />
        }
      />
      <Transition in={isExpanded} ref={expandableWrapperRef}>
        <div className={classes["expandable-area"]} ref={expandableWrapperRef}>
          {items.slice(1, items.length).map((item, index) => (
            <DropdownItem
              {...item}
              key={index}
              onClick={() => {
                props.onSelect(item);
              }}
            />
          ))}

          <button
            onClick={props.onAdd}
            className={`${commonClasses["secondary-btn-2"]} ${classes["supliment-btn"]}`}
          >
            {props.suplimentBtnText}
          </button>
        </div>
      </Transition>
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
      timeout={200}
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

const withSelectedFirst = (items: ListItem[], id?: string) => {
  const selected = items.find((i) => i.id === id);
  if (!selected) return items;

  return [selected, ...items.filter((i) => i.id !== id)];
};

export default DropdownCheckableGroup;