export type TabGroupProps = {
  items: string[];
  indexSelected: number;
  onClickItem: (index: number, label?: string) => void;
};
