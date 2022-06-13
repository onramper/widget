import TagManager from "react-gtm-module";
import * as constants from "../../ApiContext/api/constants";

export type IGtmParams = {
  gtmId: string;
  dataLayer: IDataLayer | undefined;
  dataLayerName?: string;
};

export type IDataLayer = {
  [key: string]: any;
};

export type ISendToGTM = {
  dataLayerName?: string;
  data: Object;
};

/**
 * Function to init the GTM
 * @param gtmId - The ID of the GTM
 * @param dataLayer - The dataLayer
 *  @param dataLayerName - The dataLayer name
 */
export const initGTM = ({
  gtmId,
  dataLayer,
  dataLayerName = "",
}: IGtmParams) => {
  const tagManagerArgs = {
    gtmId,
    dataLayer,
    dataLayerName,
  };
  TagManager.initialize(tagManagerArgs);
};

/**
 * Function to send the events to the GTM
 * @param dataLayerName - The dataLayer name
 * @param data - The data to push
 */
export const sendToGTM = ({ dataLayerName, data }: ISendToGTM): void => {
  const _dataLayerName = dataLayerName ?? constants.DEFAULT_GTM_DATA_LAYER;
  window[_dataLayerName].push(data);
};
