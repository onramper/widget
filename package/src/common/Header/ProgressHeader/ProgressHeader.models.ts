export type ProgressHeaderProps = {
  percentage?: number;
  primary?: boolean;
  title?: string;
  useBackButton?: boolean;
  useExitButton?: boolean;
  hideBurgerButton?: boolean;
  noSeparator?: boolean;
  onExitClick?: () => void;
  onMenuClick?: () => {};
  onBackClick?: () => void;
};
