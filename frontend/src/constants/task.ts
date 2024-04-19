import type { T_Filter } from "types/task";

export const TASK = {
  filter: [
    {
      label: "Барлығы",
      value: "all",
    },
    {
      label: "Мен құрғандар",
      value: "created",
    },
    {
      label: "Маған меншіктелгендер",
      value: "assigned",
    },
  ] as { label: string; value: T_Filter }[],
};
