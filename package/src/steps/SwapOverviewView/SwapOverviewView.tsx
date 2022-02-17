import React from "react";
import { SwapOverviewViewProps } from "./SwapOverviewView.models";
import commonClasses from "../../styles.module.css";

const SwapOverviewView = ({ nextStep }: SwapOverviewViewProps) => {
  return (
    <div className={commonClasses.view}>
      <p>step 1</p>
    </div>
  );
};

export default SwapOverviewView;
