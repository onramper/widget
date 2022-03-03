export interface GatewayIndicatorProps {
  unitFiat?: string;
  unitCrypto?: string;
  openMoreOptions: () => void;
  selectedGateway?: IGatewaySelected | null;
  isLoading: boolean;
  isInitialLoading: boolean;
  amountInCrypto: boolean;
}

export interface IGatewaySelected {
  name: string;
  rate: number | undefined;
  icon: string;
}
