export type ProgressHeaderProps = {
  percentage?: number;
  primary?: boolean;
  title?: string;
  useBackButton?: boolean;
  useExitButton?: boolean;
  onExitClick?: () => void;
  noSeparator?: boolean;
  onMenuClick?: () => {};
};
