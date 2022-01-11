import React from "react";
import ListItemButtonGroup from "../../ListItemButtonGroup/ListItemButtonGroup";
import OverlayMenu from "../../OverlayMeu/OverlayMenu";
import menuItems from "./menuItems";
import classes from "./Menu.module.css";

const Menu: React.FC<{ className?: string }> = (props) => {
  return (
    <OverlayMenu
      headerProps={{
        title: "Menu",
        className: props.className,
      }}
    >
      <ListItemButtonGroup className={classes["menu-list"]} items={menuItems} />
    </OverlayMenu>
  );
};

export default Menu;
