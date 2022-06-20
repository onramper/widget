export interface GatewayIndicatorProps {
  unitFiat?: string;
  unitCrypto?: string;
  openMoreOptions: () => void;
  selectedGateway?: IGatewaySelected;
  isLoading: boolean;
  isInitialLoading: boolean;
  amountInCrypto: boolean;
  gatewaySelectionTxt: string;
}

export interface IGatewaySelected {
  name: string;
  rate: number | undefined;
  icon: string;
}
