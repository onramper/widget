import React, { useContext } from "react";
import Header, { HeaderType } from "..";
import { tabNames as mainScreenTabNames } from "../../../BuyCryptoView/constants";
import { NavContext } from "../../../NavContext";
import TabsHeader, { ITabsHeaderProps } from "../TabsHeader/TabsHeader";

type HeaderPickerProps = (HeaderType | ITabsHeaderProps) & {
  title?: string;
};

const STEP_NAMES = {
  sellCrypto: "Sell crypto",
};

const HeaderPicker: React.FC<HeaderPickerProps> = (
  props: HeaderPickerProps
) => {
  const { backScreen } = useContext(NavContext);

  switch (props.title) {
    case STEP_NAMES.sellCrypto:
      return (
        <TabsHeader
          tabs={mainScreenTabNames}
          tabSelected={1}
          onClickItem={(i: number) => {
            if (i === 1) return;
            backScreen();
          }}
        />
      );

    default:
      return <Header {...(props as HeaderType)} />;
  }

};

export default HeaderPicker;
