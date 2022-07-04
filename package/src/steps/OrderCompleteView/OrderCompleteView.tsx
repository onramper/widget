import React, { useContext, useEffect, useState } from "react";
import classes from "./OrderCompleteView.module.css";
import commonClasses from "./../../styles.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import Lottie from "lottie-react";
import successAnimation from "../../icons/animations/success.json";
import { ButtonSecondary } from "../../common/Buttons";
import { APIContext } from "../../ApiContext";
import { useNav } from "../../NavContext";
import BuyCryptoView from "../../BuyCryptoView";
import { TokenInfo } from "layer2";
import { useNavigate } from "react-router-dom";
import { useAddTokenToMetamask } from "../../web3/hooks/useAddTokenToMetamask";

const OrderCompleteView: React.FC<{
  description: string;
  title: string;
  tokenOut: TokenInfo;
}> = (props) => {
  const { collected } = useContext(APIContext);
  const { onlyScreen } = useNav();
  const [autoPlay, setAutoPlay] = useState(false);
  const { addToken } = useAddTokenToMetamask(props.tokenOut);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAutoPlay(true);
    }, 200);
    return () => clearTimeout(timeout);
  }, []);

  const exitHandler = () => {
    navigate("/", { replace: true });
    collected.redirectURL
      ? window.open(collected.redirectURL, "_parent")
      : onlyScreen(<BuyCryptoView />);
  };

  return (
    <div className={`${commonClasses.view} ${classes["view"]}`}>
      <ProgressHeader
        onExitClick={exitHandler}
        useExitButton
        primary
        noSeparator
      />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <div className={classes["checkmark-wrapper"]}>
          <Lottie
            loop={false}
            autoplay={autoPlay}
            animationData={autoPlay ? successAnimation : undefined}
          />
        </div>
        <h1 className={commonClasses["remove-default"]}> {props.title} </h1>
        <h2 className={commonClasses["remove-default"]}>{props.description}</h2>

        <div className={classes["bottom-section"]}>
          <ButtonSecondary
            onClick={addToken}
            primary
            text={`Add ${props.tokenOut.symbol} to MetaMask`}
          />
        </div>
      </main>
    </div>
  );
};

export default OrderCompleteView;
