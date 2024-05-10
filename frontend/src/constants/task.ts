import type { T_Filter, T_TaskPriority, T_TaskStatus } from "types/task";

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

  priority: {
    none: 0 as T_TaskPriority,
    low: 1 as T_TaskPriority,
    medium: 2 as T_TaskPriority,
    high: 3 as T_TaskPriority,
    urgent: 4 as T_TaskPriority,
  },

  priorityOptions: [
    { label: "Жоқ", value: 0 },
    { label: "Төмен", value: 1 },
    { label: "Орташа", value: 2 },
    { label: "Жоғары", value: 3 },
    { label: "Шұғыл", value: 4 },
  ],

  status: {
    backlog: 0 as T_TaskStatus,
    analyze: 1 as T_TaskStatus,
    develop: 2 as T_TaskStatus,
    test: 3 as T_TaskStatus,
    finish: 4 as T_TaskStatus,
  },

  statusOptions: [
    {
      label: "Архив",
      value: 0,
    },
    {
      label: "Талдау",
      value: 1,
    },
    {
      label: "Әзірлеу",
      value: 2,
    },
    {
      label: "Сынақ",
      value: 3,
    },
    {
      label: "Аяқталған",
      value: 4,
    },
  ],
};
