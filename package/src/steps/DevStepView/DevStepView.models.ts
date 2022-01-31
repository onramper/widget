import { OverviewStepItem, OverviewStepSubItem } from "../../common/StepsOverview/StepsOverview.models";

type OverviewStepSubItemDev = OverviewStepSubItem & { values: string[] };
type OverviewStepItemDev = Omit<OverviewStepItem, "items"> & {
    items?: OverviewStepSubItemDev[]
}

type DevStepDataBase = {
    type: string;
}

export type DevStepData = DevStepDataBase & ({
    type: "StepsOverview",
    items: OverviewStepItemDev[]
});

export type NextStepDev = {
    type: "devStep";
    url?: string;
    data: DevStepData[]
}