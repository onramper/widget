import React from "react";

export type OverviewStepSubItem = {
  content?: string | React.ReactNode;
  checked?: boolean;
};

export type OverviewStepItem = {
  title: string;
  description: string;
  icon: string | React.ReactNode;
  selected?: boolean;
  items?: OverviewStepSubItem[];
  info?: string;
  className?: string;
};

export type OverviewStepSubItemProps = OverviewStepSubItem;

export type StepOverviewItemProps = OverviewStepItem & {
  onClick?: () => void;
  onClickInfo?: () => void;
};

export type StepsOverviewProps = {
  variant?: "default" | "primary";
  className?: string;
  items: OverviewStepItem[];
  onClickItem?: (index: number) => void;
};
