import React, { useContext } from "react";
import styles from "./TabsHeader.module.css";
import Menu from "../Menu";
import { NavContext } from "../../../NavContext";
import TabGroup from "../../TabGroup/TabGroup";
import IconMenu from "../../../icons/menu-var-2.svg";

export type ITabsHeaderProps = {
  onMenuClick?: () => void;
  tabs: string[];
  tabSelected: number;
  onClickItem: (index: number) => void;
}

const TabsHeader: React.FC<ITabsHeaderProps> = (props: ITabsHeaderProps) => {
  const { nextScreen } = useContext(NavContext);
  const { onMenuClick = () => nextScreen(<Menu />) } = props;

  return (
    <nav className={styles.header}>
      <TabGroup
        items={props.tabs}
        indexSelected={props.tabSelected}
        onClickItem={props.onClickItem}
      />
      <img
        onClick={onMenuClick}
        alt="menu"
        className={`${styles["header__burger-icon"]}`}
        src={IconMenu}
      />
    </nav>
  );
};

export default TabsHeader;
