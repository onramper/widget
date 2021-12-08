import { ItemType } from "../../ApiContext";
import { ListItemType } from "../ListRedesign/List.models";

export type OverlayPickerProps = {
  title: string;
  items: ListItemType[];
  name?: string;
  searchable?: boolean;
  onItemClick?: (listName: string, index: number, item: ItemType) => void;
};
