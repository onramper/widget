import React, { useCallback, useContext, useEffect, useState } from "react";
import stylesCommon from "../../styles.module.css";

import ButtonAction from "../../common/ButtonAction";
import Footer from "../../common/Footer";
import StepsOverview from "../../common/StepsOverview/StepsOverview";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import { DevStepData, NextStepDev } from "./DevStepView.models";
import { APIContext, NextStep } from "../../ApiContext";
import Heading from "../../common/Heading/Heading";
import { NavContext } from "../../NavContext";
import ErrorView from "../../common/ErrorView";
import Step from "../Step";
import InfoBox from "../../common/InfoBox";

const DevStepView: React.FC<{ nextStep: NextStep }> = (props) => {
  const [data, setData] = useState<DevStepData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const { nextScreen } = useContext(NavContext);
  const { apiInterface } = useContext(APIContext);

  const onButtonAction = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const newNextStep = await apiInterface.executeStep(props.nextStep, {});
      nextScreen(<Step nextStep={newNextStep} />);
    } catch (_error) {
      const error = _error as { fatal: any; message: string };
      if (error.fatal) {
        nextScreen(<ErrorView />);
        return;
      }
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  }, [apiInterface, nextScreen, props]);

  const renderData = useCallback(() => {
    return (
      <>
        {data.map((item, index) => {
          switch (item.type) {
            case "StepsOverview":
              return (
                <StepsOverview
                  key={index}
                  className={stylesCommon["shrink-0"]}
                  items={item.items}
                />
              );
            default:
              return "";
          }
        })}
      </>
    );
  }, [data]);

  useEffect(() => {
    const withOverview = (dataItem: DevStepData) => {
      const overviewItems = dataItem.items.map((i) => {
        if(!i.items) {
          return i;
        }

        const subItemsWithContent = i.items.map((subItem) => {
          if (subItem.values?.length > 1) {
            subItem.content = (
              <>
                {subItem.values[0]}{" "}
                <span className={stylesCommon["semibold"]}>
                  {subItem.values[1]}
                </span>
              </>
            );
          }
          return subItem;
        });

        return {
          ...i,
          items: subItemsWithContent,
        };
      });
      dataItem.items = overviewItems;
      return dataItem;
    };

    setData(
      (props.nextStep as NextStepDev).data.map((item) => {
        if (item.type === "StepsOverview") {
          return withOverview(item);
        }
        return item;
      })
    );
  }, [props.nextStep]);

  return (
    <div className={stylesCommon.view}>
      <ProgressHeader
        percentage={props.nextStep.progress}
        title={!props.nextStep.useHeading ? props.nextStep.title : undefined}
        useBackButton
      />
      <main className={stylesCommon.body}>
        <InfoBox
          type="error"
          in={!!errorMessage}
          className={`${stylesCommon.body__child}`}
          canBeDismissed
          onDismissClick={() => setErrorMessage(undefined)}
        >
          {errorMessage}
        </InfoBox>

        {props.nextStep.useHeading && (
          <Heading
            text={props.nextStep.title}
            textSubHeading={props.nextStep.description}
          />
        )}

        {renderData()}

        <div className={`${stylesCommon.body__child}`}>
          <ButtonAction
            onClick={onButtonAction}
            text={isLoading ? "Loading..." : "Continue"}
            disabled={!!isLoading}
          />
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default DevStepView;
