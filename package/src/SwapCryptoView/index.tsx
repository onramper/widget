import PlayGround from "./PlayGround";
import React, { useCallback, useContext, useEffect } from "react";
import { BASE_API } from "../ApiContext/api/constants";
import { NavContext } from "../NavContext";
import Step from "../steps/Step";

const SwapCryptoView = () => {
  const { nextScreen } = useContext(NavContext);

  const goToSwapScreen = useCallback(async (name = "transactionOverview") => {
    const stepUrl = `${BASE_API}/GoTo/TestGateway/${name}`;
    const swapStep = await (
      await fetch(`${stepUrl}`, { method: "POST" })
    ).json();
    nextScreen(<Step nextStep={swapStep} />);
  }, [nextScreen]);

  useEffect(() => {
    goToSwapScreen();
  }, [goToSwapScreen]);

  return <PlayGround />;
};

export default SwapCryptoView;
