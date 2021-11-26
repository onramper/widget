import React from "react";
import stylesCommon from "../styles.module.css";
import InfoBox from "../common/InfoBox";
import ErrorVisual from "../common/ErrorVisual";

const FallbackErrorView: React.FC = () => (
  <main className={stylesCommon.body}>
    <InfoBox in={true} type="info" className={`${stylesCommon.body__child}`}>
      No prices available at this time.
    </InfoBox>
    <div className={`${stylesCommon.body__child} ${stylesCommon.grow}`}>
      <ErrorVisual message="An error occurred while trying to connect to server. Please try again later." />
    </div>
  </main>
);

export default FallbackErrorView;
