import React from "react";
import iconMenu from "../../../icons/menu-var-2.svg";
import TabGroup from "../../TabGroup/TabGroup";
import headerClasses from "../Header.module.css";
import classes from "./TabsHeader.module.css";

export type ITabsHeaderProps = {
  onMenuClick?: () => void;
  tabs: string[];
  tabSelected: number;
  onClickItem: (index: number, label?: string) => void;
};

const TabsHeader: React.FC<ITabsHeaderProps> = (props: ITabsHeaderProps) => {
  return (
    <nav className={classes.header}>
      <TabGroup
        items={props.tabs}
        indexSelected={props.tabSelected}
        onClickItem={props.onClickItem}
      />
      <img
        onClick={props.onMenuClick}
        alt="menu"
        className={`${headerClasses["header-burger-icon"]}`}
        src={iconMenu}
      />
    </nav>
  );
};

export default TabsHeader;
